import { LoginInformation, loginService, RegisterInformation } from "@/services/login.service";
import { acceptHMRUpdate, defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useUserStore = defineStore("user", {
	state: () => {
		return { loading: false, loggedIn: false, user: false };
	},

	actions: {
		async login(data: LoginInformation) {
			this.loading = true;
			this.loggedIn = false;
			try {
				await loginService.login(data);
				this.loggedIn = true;
				toast.success("Logged in!!");
			} catch (e) {
				toast.error("Something went wrong");
				throw e;
			} finally {
				this.loading = false;
			}
		},

		async register(data: RegisterInformation) {
			this.loading = true;
			this.loggedIn = false;
			try {
				await loginService.register(data);
				this.loggedIn = true;
				toast.success("Created new account!!");
			} catch (e) {
				toast.error("Something went wrong");
				throw e;
			} finally {
				this.loading = false;
			}
		},
	},
});

// const actions: ActionTree<LoginState, State> = {
// 	login({ commit }, { username, password }) {
// 		commit("loginRequest", { username });

// 		let result = loginService.login(username, password);
// 		if (result) {
// 			commit("loginSuccess");
// 			console.log("login success");
// 			router.push("/home");
// 		}
// 	},
// 	logout({ commit }) {
// 		commit("resetState");
// 		router.push("/");
// 	},
// 	clearState({ commit }) {
// 		commit("resetState");
// 	},
// };

// const mutations: MutationTree<LoginState> = {
// 	resetState(state) {
// 		state.isLoggedIn = false;
// 		state.user = null;
// 	},
// 	loginRequest(state, user) {
// 		state.isLoggedIn = true;
// 		state.user = user;
// 	},
// 	loginSuccess(state) {
// 		state.isLoggedIn = true;
// 		state.user = null;
// 	},
// 	loginFailure(state) {
// 		state.isLoggedIn = false;
// 	},
// };

// export const login = createVuexModule({
// 	state,
// 	actions,
// 	mutations,
// });
