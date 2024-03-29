import { ValidComponentNames } from "@/components/widgets";
import { generateKey } from "@/helpers/generateKeyFromWidget";
import { RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core";
import axios from "axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import * as Sentry from "@sentry/vue";
import { ALL_LOCATIONS, User, UserFromAPI, UserWidget, Widget } from "@/helpers/types/user";

import auth from "@/auth";

const toast = useToast();
// Default widgets are widgets that are available for everyone
export const DEFAULT_WIDGETS = ["battery", "dummy", "remotedevices"];

export const useUserStore = defineStore("user", {
	state: () => {
		return {
			loading: { userdata: true, settings: false },
			user: null,
			favorites: useLocalStorage<{ name: string; url: string }[]>("user.settings.favorites", [], {
				serializer: StorageSerializers.object,
			}),
			widgets: useLocalStorage<UserWidget>(
				"widgets",
				{
					topleft: [],
					topright: [],
					bottomleft: [],
					bottomright: [],
				},
				{
					serializer: StorageSerializers.object,
				}
			),
		} as {
			loading: { userdata: boolean; settings: boolean };
			user: User | null;
			favorites: RemovableRef<{ name: string; url: string }[]>;
			widgets: RemovableRef<UserWidget>;
		};
	},

	getters: {
		isLoading(state) {
			return state.loading.settings || state.loading.userdata;
		},
		loggedIn(state) {
			return !!state.user;
		},
	},

	actions: {
		waitUntilLoggedinAndLoaded() {
			return new Promise<void>((resolve, reject) => {
				if (!this.loading.userdata) {
					if (this.loggedIn) {
						resolve();
					} else {
						reject();
					}
					return;
				}

				const unsub = this.$subscribe((mut, state) => {
					if (!state.loading.userdata) {
						if (!!state.user) {
							resolve();
							unsub();
						} else {
							Sentry.captureMessage(`Rejected wait until logged in: ${JSON.stringify(state)}`);
							reject();
							unsub();
						}
					}
				});
			});
		},

		async refreshUserInfo() {
            try {
                await this.getUserData((await auth.getUser(true)) || undefined);
            } catch(e) {
                this.logout()
            }
		},

		async getUserData(cachedUser?: UserFromAPI) {
			this.loading.userdata = true;
			try {
				console.log("Getting user data");
				this.user = cachedUser || (await auth.getUser());
				if (!this.user) {
					this.loading.userdata = false;
					this.user = null;
					return;
				}

				Sentry.setUser({ email: this.user.email });

				const validWidgetsNames = new Set<string>(this.user.settings.widgetsAvailable.map((x) => x.name));

				// Add in dummy widget on preview and development
				if (
					!DEFAULT_WIDGETS.includes("dummy") &&
					(window.env.VUE_APP_VERCEL_ENV === "preview" || window.env.VUE_APP_VERCEL_ENV === "development")
				) {
					DEFAULT_WIDGETS.push("dummy");
					DEFAULT_WIDGETS.push("remotedevices");
				}

				DEFAULT_WIDGETS.forEach((x) => validWidgetsNames.add(x));

				// Always filter to prevent invalidity when changing localstorage yourself
				const uniqueCount = new Set<String>();
				for (const x of ALL_LOCATIONS) {
					this.widgets[x] = this.widgets[x].filter((x) => {
						if (!x || uniqueCount.has(generateKey(x))) {
							return false;
						}

						uniqueCount.add(generateKey(x));

						return validWidgetsNames.has(x.name);
					}) as Widget[];
				}
			} catch (e: any) {
				toast.warning("Please login again");
				Sentry.captureEvent({
					message: "User data error",
					extra: {
						error: e,
						user: this.user,
						loggedIn: this.loggedIn,
					},
				});
				console.error(e);
			}

			this.loading.userdata = false;
		},

		async saveSettings() {
			this.loading.settings = true;
			// TODO: Fix this
			console.warn("Saving settings is disabled");
			// try {
			// 	const copy = JSON.parse(JSON.stringify(this.user!.settings));
			// 	delete copy.widgetsAvailable;
			// 	await axios.patch("/api/settings/me", copy);
			// } catch (e) {
			// 	console.log("Something went wrong with saving settings", e);
			// 	toast.error("Something went wrong with saving settings");
			// 	this.getUserData();
			// }
			this.loading.settings = false;
		},

		async logout() {
			this.widgets = {
				topleft: [],
				topright: [],
				bottomleft: [],
				bottomright: [],
			};
			this.favorites = [];
			await auth.logout();
			this.user = null;
			const text = "You have been logged out";
			toast.success(text);
		},
	},
});

/**
 * Add callbacks that modify the store when a user authenticates
 */
export function enableAuth() {
	const store = useUserStore();

	const authed = (user: UserFromAPI) => {
		store.getUserData(user);
	};
	const unauthed = () => {
		store.user = null;
	};
	auth.registerCallbacks(authed, unauthed);
}

export function enableSettingWatching() {
	const store = useUserStore();
	let prevSettings = JSON.stringify(store.user?.settings);

	store.$subscribe((mutation, state) => {
		if (state.user && !state.loading.userdata && !state.loading.settings) {
			const newSettings = JSON.stringify(state.user.settings);
			if (prevSettings !== newSettings) {
				console.log("Settings changed, saving");
				prevSettings = newSettings;
				store.saveSettings();
			}
		}
	});
}
