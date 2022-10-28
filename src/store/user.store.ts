import { ValidComponentNames } from "@/components/widgets";
import { generateKey } from "@/helpers/generateKeyFromWidget";
import { LoginInformation, loginService, RegisterInformation } from "@/services/login.service";
import { RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core";
import axios from "axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();
// Default widgets are widgets that are available for everyone
export const DEFAULT_WIDGETS = ["Battery", "Pauze"];

// if (window.env.VUE_APP_VERCEL_ENV === "preview" || window.env.VUE_APP_VERCEL_ENV === "development") {
// 	DEFAULT_WIDGETS.push("Dummy");
// 	DEFAULT_WIDGETS.push("RemoteDevices");
// }

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
		background: string;
		widgets: { [key in ValidLocation]: Widget[] };
		widgetsAvailable: Widget[];
	};
};

export const useUserStore = defineStore("user", {
	state: () => {
		return {
			loading: { form: false, userdata: false },
			loggedIn: useLocalStorage("loggedIn", false),
			user: useLocalStorage("user", null, {
				serializer: StorageSerializers.object,
			}) as RemovableRef<User | null>,
			accessToken: useLocalStorage("accessToken", ""),
			refreshToken: useLocalStorage("refreshToken", ""),
		};
	},

	actions: {
		async getUserData() {
			if (!this.loggedIn) {
				this.user = null;
				return;
			}

			this.loading.userdata = true;

			try {
				const userInformation = (await axios.get("/api/users/me")).data;
				const userSettings = (await axios.get("/api/settings/me")).data;
				console.log("Got user data: ", userInformation, "and settings: ", userSettings);
				if (!this.user) {
					// Default user data for testing
					this.user = {
						name: "",
						email: "",
						settings: {
							showDate: false,
							showSeconds: true,
							showVersion: false,
							background: "",
							widgets: {
								topleft: [],
								topright: [{ name: "VIA", id: "pos" }],
								bottomleft: [],
								bottomright: [{ name: "Pauze", id: "1" }],
							},
							widgetsAvailable: [],
						},
					};
				}
				this.user.name = userInformation.name;
				this.user.email = userInformation.email;
				this.user.settings.background = userSettings.backgroundURL || "";

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
				toast.error("Something went wrong with getting user data");
				console.error(e);
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
			// TODO: This doesn't work
			this.$reset();
			window.localStorage.clear();
		},

		async login(data: LoginInformation) {
			this.loading.form = true;
			this.loggedIn = false;
			try {
				const tokens = await loginService.login(data);
				this.accessToken = tokens.access;
				this.refreshToken = tokens.refresh;

				this.loggedIn = true;
				toast.success("Logged in!!");
				this.getUserData();
			} catch (e) {
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
				this.getUserData();
			} catch (e) {
				toast.error("Something went wrong");
				throw e;
			} finally {
				this.loading.form = false;
			}
		},
	},
});
