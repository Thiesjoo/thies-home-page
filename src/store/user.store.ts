import { ValidComponentNames } from "@/components/widgets";
import { getBaseURL, Interrupted } from "@/helpers/auto-refresh-tokens";
import { generateKey } from "@/helpers/generateKeyFromWidget";
import { LoginInformation, loginService, RegisterInformation } from "@/services/login.service";
import { RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();
// Default widgets are widgets that are available for everyone
export const DEFAULT_WIDGETS = ["battery", "pauze"];

export type ValidLocation = "topleft" | "bottomleft" | "topright" | "bottomright";
export const ALL_LOCATIONS: ValidLocation[] = ["topleft", "bottomleft", "topright", "bottomright"];

export type Widget = {
	name: ValidComponentNames | Lowercase<ValidComponentNames>;
	id: string;
};

export type User = {
	name: string;
	settings: {
		showSeconds: boolean;
		showVersion: boolean;
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
				const res = await (await fetch("/api/whoami")).json();
				if (!this.user) {
					// Default user data for testing
					this.user = {
						name: "",
						settings: {
							showSeconds: true,
							showVersion: false,
							widgets: {
								topleft: [],
								topright: [{ name: "VIA", id: "POS" }],
								bottomleft: [],
								bottomright: [{ name: "Pauze", id: "1" }],
							},
							widgetsAvailable: [],
						},
					};
				}
				this.user.name = res.name;

				const allWidgetsAvailable: Widget[] = await (await fetch(getBaseURL() + "/api/providers/me")).json();
				this.user.settings.widgetsAvailable = allWidgetsAvailable;

				const validWidgets = new Set<string>(allWidgetsAvailable.map((x) => x.name));

				DEFAULT_WIDGETS.forEach((x) => validWidgets.add(x));

				// Always filter to prevent invalidity
				const uniqueCount = new Set<String>();
				// TODO: CHeck for unique keys
				for (const x of ALL_LOCATIONS) {
					this.user.settings.widgets[x] = this.user.settings.widgets[x].filter((x) => {
						if (!x || uniqueCount.has(generateKey(x))) {
							return false;
						}

						uniqueCount.add(generateKey(x));

						return validWidgets.has(x.name.toLowerCase());
					}) as Widget[];
				}
			} catch (e) {
				if (e instanceof Interrupted) {
					console.error("Request was interrupted, not modifying state");
					this.loading.userdata = false;
					return;
				}
				toast.error("Something went wrong with getting user data");
				console.error(e);
				this.loggedIn = false;
				this.user = null;
				this.accessToken = "";
			}

			this.loading.userdata = false;
		},

		async logout() {
			try {
				await loginService.logout();
			} catch (e) {
				toast.error("Something went wrong with token deletion");
			}
			this.loggedIn = false;
			this.user = null;
			this.accessToken = "";
			this.loading.form = false;
			this.loading.userdata = false;
		},

		async login(data: LoginInformation) {
			this.loading.form = true;
			this.loggedIn = false;
			try {
				const tokens = await loginService.login(data);
				this.accessToken = tokens.access;

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
