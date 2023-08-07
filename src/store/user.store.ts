import { ValidComponentNames } from "@/components/widgets";
import { generateKey } from "@/helpers/generateKeyFromWidget";
import { RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core";
import axios from "axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import * as Sentry from "@sentry/vue";
import { ALL_LOCATIONS, User, UserFromAPI, Widget } from "@/helpers/types/user";

import auth from "@/auth";

const toast = useToast();
// Default widgets are widgets that are available for everyone
export const DEFAULT_WIDGETS = ["battery", "dummy", "remotedevices"];

const defaultUser: User = {
	name: {
		first: "",
		last: "",
	},
	email: "",
	settings: {
		showDate: false,
		showSeconds: true,
		showVersion: false,
		showFavorites: false,
		favorites: [],
		backgroundURL: "",
		widgets: {
			topleft: [],
			topright: [],
			bottomleft: [],
			bottomright: [],
		},
		widgetsAvailable: [],
	},
};

export const useUserStore = defineStore("user", {
	state: () => {
		return {
			loading: { userdata: true, settings: false },
			user: null,
		} as {
			loading: { userdata: boolean; settings: boolean };
			user: User | null;
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

		createUser() {
			return JSON.parse(JSON.stringify(defaultUser)) as User;
		},

		// Sentry.setUser({ email });
		async getUserData(secondTime = false) {
			if (!this.loggedIn) {
				this.loading.userdata = false;
				this.user = null;
				return;
			}
			this.loading.userdata = true;
			Sentry.captureMessage("Getting user data");
			try {
				if (!this.user) {
					this.user = this.createUser();
				}

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
					this.user.settings.widgets[x] = this.user.settings.widgets[x].filter((x) => {
						if (!x || uniqueCount.has(generateKey(x))) {
							return false;
						}

						uniqueCount.add(generateKey(x));

						return validWidgetsNames.has(x.name);
					}) as Widget[];
				}
				Sentry.captureMessage("Finished getting user data");
			} catch (e: any) {
				toast.warning("Please login again");
				Sentry.captureException(e);
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
			Sentry.captureMessage("Logout method called");

			this.user = null;
			const text = "You have been logged out";
			if (result) {
				toast.success(text);
			} else {
				toast.warning(text);
			}
		},
	},
});

export function enableAuth() {
	const store = useUserStore();

	const authed = () => {};
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
