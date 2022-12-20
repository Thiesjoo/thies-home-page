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
export const DEFAULT_WIDGETS = ["Battery", "Pauze", "Dummy", "RemoteDevices"];

export type ValidLocation = "topleft" | "bottomleft" | "topright" | "bottomright";
export const ALL_LOCATIONS: ValidLocation[] = ["topleft", "bottomleft", "topright", "bottomright"];

export type Widget = {
	name: ValidComponentNames;
	id: string;
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
		devices: {
			api: string;
			enabled: boolean;
		};
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
			topright: [{ name: "VIA", id: "pos" }],
			bottomleft: [],
			bottomright: [{ name: "Pauze", id: "1" }],
		},
		widgetsAvailable: [],
		devices: {
			api: "",
			enabled: false,
		},
	},
};

export const useUserStore = defineStore("user", {
	state: () => {
		return {
			// Always loading userdata, because we want to check if the user is logged in
			loading: { form: false, userdata: true },
			loggedIn: useLocalStorage("loggedIn", false),
			user: useLocalStorage("user", null, {
				serializer: StorageSerializers.object,
			}) as RemovableRef<User | null>,
			accessToken: useLocalStorage("accessToken", ""),
			refreshToken: useLocalStorage("refreshToken", ""),
		};
	},

	getters: {
		isLoading(state) {
			return state.loading.form || state.loading.userdata;
		},
	},

	actions: {
		async getUserData() {
			if (!this.loggedIn) {
				this.loading.userdata = false;
				this.user = null;
				return;
			}

			try {
				const userInformation = (await axios.get("/api/users/me")).data;
				const syncedUserSettings = (await axios.get("/api/settings/me")).data;
				// TODO: Sync this data with the server

				console.log("Got user data: ", userInformation, "and settings: ", syncedUserSettings);
				if (!this.user) {
					// Default user data for testing
					this.user = JSON.parse(JSON.stringify(defaultUser)) as User;

					// Sync the user settings with the default user object
					this.user.settings = { ...this.user.settings, ...syncedUserSettings };
				} else {
					this.user.settings = { ...this.user.settings, ...syncedUserSettings };

					// Check if the user has the required properties
					this.user = {
						...defaultUser,
						...this.user,
						settings: {
							...defaultUser.settings,
							...this.user.settings,
							widgets: {
								...defaultUser.settings.widgets,
								...this.user.settings.widgets,
							},
							devices: {
								...defaultUser.settings.devices,
								...this.user.settings.devices,
							},
						},
					};
				}

				this.user.name = userInformation.name;
				this.user.email = userInformation.email;

				const allWidgetsAvailable: Widget[] = (await axios("/api/providers/me")).data;
				this.user.settings.widgetsAvailable = allWidgetsAvailable.map((x) => {
					if (x.name.toLowerCase() === "via") {
						return {
							name: "VIA",
							id: x.id,
						};
					}

					return x;
				});

				const validWidgetsNames = new Set<string>(this.user.settings.widgetsAvailable.map((x) => x.name));

				// Add in dummy widget on preview and development
				if (
					!DEFAULT_WIDGETS.includes("Dummy") &&
					(window.env.VUE_APP_VERCEL_ENV === "preview" || window.env.VUE_APP_VERCEL_ENV === "development")
				) {
					DEFAULT_WIDGETS.push("Dummy");
					DEFAULT_WIDGETS.push("RemoteDevices");
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

		async logout() {
			try {
				await loginService.logout();
			} catch (e) {
				toast.error("Something went wrong with token deletion");
			}
			this.accessToken = "";
			this.refreshToken = "";
			this.loggedIn = false;
			this.user = null;
			toast.warning("You have been logged out");
		},

		async loginWithWebauth() {
			let tokens: { access: string; refresh: string };
			tokens = await loginWithPasskey();

			this.accessToken = tokens.access;
			this.refreshToken = tokens.refresh;

			this.loggedIn = true;
			toast.success("Logged in!!");
			this.getUserData();
		},

		async login(data: LoginInformation) {
			this.loading.form = true;
			this.loggedIn = false;
			try {
				let tokens: { access: string; refresh: string } = await loginService.login(data);

				this.accessToken = tokens.access;
				this.refreshToken = tokens.refresh;

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
