import { ValidComponentNames } from "@/components/widgets";
import { generateKey } from "@/helpers/generateKeyFromWidget";
import { RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core";
import axios from "axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import * as Sentry from "@sentry/vue";
import { Passage, PassageUserInfo } from "@passageidentity/passage-js";

const toast = useToast();
// Default widgets are widgets that are available for everyone
export const DEFAULT_WIDGETS = ["battery", "dummy", "remotedevices"];

export type ValidLocation = "topleft" | "bottomleft" | "topright" | "bottomright";
export const ALL_LOCATIONS: ValidLocation[] = ["topleft", "bottomleft", "topright", "bottomright"];

export type Widget = {
	name: ValidComponentNames;
	id: string;
};

export type User = {
	name: {
		first: string;
		last: string;
	};
	email: string;
	settings: {
		backgroundURL: string;
		showSeconds: boolean;
		showDate: boolean;
		showVersion: boolean;
		showFavorites: boolean;
		favorites: { name: string; url: string }[];
		widgets: { [key in ValidLocation]: Widget[] };
		widgetsAvailable: Widget[];
	};
};

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
			// Always loading userdata, because we want to check if the user is logged in
			loading: { form: false, userdata: true, settings: false },
			loggedIn: useLocalStorage("loggedIn", false),
			user: useLocalStorage("user", null, {
				serializer: StorageSerializers.object,
			}) as RemovableRef<User | null>,
			accessToken: useLocalStorage("accessToken", ""),
		};
	},

	getters: {
		isLoading(state) {
			return state.loading.form || state.loading.userdata;
		},
	},

	actions: {
		waitUntilLoaded() {
			return new Promise<void>((resolve, reject) => {
				if (this.loggedIn && !this.loading.userdata) {
					resolve();
					return;
				}

				const unsub = this.$subscribe((mut, state) => {
					if (!state.loading.userdata) {
						if (state.loggedIn) {
							resolve();
							unsub();
						} else {
							reject();
							unsub();
						}
					}
				});
			});
		},

		async getBasicUserInformation() {
			const passage = new Passage(window.env.PASSAGE_APP_ID);
			const currentUser = passage.getCurrentUser();

			const userInformation = await currentUser.userInfo();
			if (!userInformation) throw new Error("User information is null");

			// Use passage to get user information
			this.applyNewUserInformation(userInformation);
			return userInformation;
		},

		async getBasicUserSettings() {
			const syncedUserSettings = (await axios.get("/api/settings/me")).data;
			this.user!.settings = syncedUserSettings;
		},

		createUser() {
			return JSON.parse(JSON.stringify(defaultUser)) as User;
		},

		applyNewUserInformation({ user_metadata, email }: PassageUserInfo) {
			Sentry.setUser({ email });

			const { first_name, last_name } = user_metadata || {};
			this.user!.name = {
				first: (first_name as string) || "no first name set",
				last: (last_name as string) || "no last name",
			};
			this.user!.email = email;
		},

		async getUserData() {
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

				const promises = [this.getBasicUserInformation(), this.getBasicUserSettings()];
				await Promise.all(promises);

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
				Sentry.captureMessage("Got user data");
			} catch (e) {
				toast.warning("Please login again");
				Sentry.captureException(e);

				console.error(e);

				window.localStorage.clear();
				this.$reset();
				window.localStorage.clear();
			}

			this.loading.userdata = false;
		},

		async saveSettings() {
			this.loading.settings = true;
			try {
				const copy = JSON.parse(JSON.stringify(this.user!.settings));
				delete copy.widgetsAvailable;
				await axios.patch("/api/settings/me", copy);
			} catch (e) {
				console.log("Something went wrong with saving settings", e);
				toast.error("Something went wrong with saving settings");
				this.getUserData();
			}
			this.loading.settings = false;
		},

		async logout() {
			const passage = new Passage(window.env.PASSAGE_APP_ID);
			const result = await passage.getCurrentSession().signOut();

			this.accessToken = "";
			this.loggedIn = false;
			this.user = null;
			const text = "You have been logged out";
			if (result) {
				toast.success(text);
			} else {
				toast.warning(text);
			}
		},

		async passageLoginSuccess(accessToken: string) {
			try {
				this.accessToken = accessToken;

				this.loggedIn = true;
				toast.success("Logged in!!");
				this.getUserData();
			} catch (e) {
				this.accessToken = "";
			}
		},
	},
});

export function enableSettingWatching() {
	const store = useUserStore();
	let prevSettings = JSON.stringify(store.user?.settings);

	store.$subscribe((mutation, state) => {
		if (state.user && !state.loading.userdata && !state.loading.form) {
			const newSettings = JSON.stringify(state.user.settings);
			if (prevSettings !== newSettings) {
				console.log("Settings changed, saving");
				prevSettings = newSettings;
				store.saveSettings();
			}
		}
	});
}
