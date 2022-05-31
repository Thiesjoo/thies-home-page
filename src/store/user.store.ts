import { LoginInformation, loginService, RegisterInformation } from "@/services/login.service";
import { RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core";
import { acceptHMRUpdate, defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export type User = {
	name: string;
	settings: {
		showSeconds: boolean;
		showVersion: boolean;
		widgets: { type: "spotify"; location: "topleft" | "bottomleft" | "topright" | "bottomright" }[];
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
			accessToken: "",
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
					this.user = {
						name: "",
						settings: { showSeconds: false, showVersion: true, widgets: [] },
					};
				}
				this.user.name = res.name;
				this.user.settings.widgets = [{ type: "spotify", location: "topleft" }];
				// console.info(res);
			} catch (e) {
				toast.error("Something went wrong with getting user data");
				console.error(e);
				this.loggedIn = false;
				this.user = null;
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
