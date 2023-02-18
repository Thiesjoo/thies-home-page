import { ValidComponentNames } from "@/components/widgets";
import { generateKey } from "@/helpers/generateKeyFromWidget";
import { loginWithPasskey } from "@/helpers/webauthn";
import { LoginInformation, loginService, RegisterInformation } from "@/services/login.service";
import { RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core";
import axios from "axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();
// Default widgets are widgets that are available for everyone
export const DEFAULT_WIDGETS = ["battery", "pauze", "dummy", "remotedevices"];

export type ValidLocation = "topleft" | "bottomleft" | "topright" | "bottomright";
export const ALL_LOCATIONS: ValidLocation[] = ["topleft", "bottomleft", "topright", "bottomright"];

export type Widget = {
	name: ValidComponentNames;
	id: string;
};

export type MeUserApi = {
	uid: string;
	name: string;
	email: string;
};

export type User = {
	name: string;
	email: string;
	settings: {
		showSeconds: boolean;
		showDate: boolean;
		showVersion: boolean;
		backgroundURL: string;
		widgets: { [key in ValidLocation]: Widget[] };
		widgetsAvailable: Widget[];
	};
};

const defaultUser: User = {
	name: "",
	email: "",
	settings: {
		showDate: false,
		showSeconds: true,
		showVersion: false,
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
			const userInformation = (await axios.get("/api/users/me")).data;
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

		applyNewUserInformation({ name, email }: MeUserApi) {
			this.user!.name = name;
			this.user!.email = email;
		},

		async getUserData() {
			if (!this.loggedIn) {
				this.loading.userdata = false;
				this.user = null;
				return;
			}
			this.loading.userdata = true;

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
			} catch (e) {
				toast.warning("Please login again");
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
			}
			this.loading.settings = false;
		},

		async logout() {
			try {
				await loginService.logout();
			} catch (e) {
				toast.error("Something went wrong with token deletion");
			}
			this.accessToken = "";
			this.loggedIn = false;
			this.user = null;
			toast.warning("You have been logged out");
		},

		async loginWithWebauth(recaptchaToken: string) {
			try {
				this.loading.form = true;
				let tokens: { access: string; refresh: string };
				tokens = await loginWithPasskey(recaptchaToken);

				this.accessToken = tokens.access;

				this.loggedIn = true;
				toast.success("Logged in!!");
				this.getUserData();
			} catch (e) {
				this.accessToken = "";
			} finally {
				this.loading.form = false;
			}
		},

		async login(data: LoginInformation) {
			this.loading.form = true;
			this.loggedIn = false;
			try {
				let tokens: { access: string; refresh: string } = await loginService.login(data);

				this.accessToken = tokens.access;

				this.loggedIn = true;
				toast.success("Logged in!!");
				await this.getUserData();
			} catch (e) {
				console.warn("Login failed inside store: ", e);
				toast.error("Something went wrong");
				this.accessToken = "";
				throw e;
			} finally {
				this.loading.form = false;
			}
		},

		async register(data: RegisterInformation) {
			this.loading.form = true;
			this.loggedIn = false;
			try {
				const tokens = await loginService.register(data);
				this.accessToken = tokens.access;

				this.loggedIn = true;
				toast.success("Created new account!!");
				await this.getUserData();
			} catch (e) {
				toast.error("Something went wrong");
				throw e;
			} finally {
				this.loading.form = false;
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
