declare global {
	interface Window {
		networking: {
			currentlyLoadingRequests: number;
			failedFetches: number;
			failedRequests: number;
		};
		env: {
			VUE_APP_VERCEL_ENV: "production" | "preview" | "development";
			VUE_APP_VERCEL_URL: string;
			VUE_APP_VERCEL_GIT_COMMIT_SHA: string;
			VUE_APP_VERCEL_GIT_COMMIT_MESSAGE: string;
			BASEURL: string;
		};
	}
}

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

/* Fontawesome shizz */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import {
	faArrowRightFromBracket,
	faBolt,
	faChargingStation,
	faLock,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { clickOutsideDirective } from "./helpers/clickOutside";
import { overwriteFetch } from "./helpers/auto-refresh-tokens";

import { VueReCaptcha } from "vue-recaptcha-v3";

/** Tailwind shizz */
import "./index.css";

import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useUserStore } from "./store/user.store";

//@ts-ignore
window.env = ENV;
window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA = window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA || "PLACEHOLDERAood4vTEZvU";

library.add(faTwitch, faXmark, faLock, faArrowRightFromBracket, faBolt);

const app = createApp(App, { router });
app.use(router);

app.use(createPinia());
app.use(Toast, {});

// Pinia is now loaded, so we can use overwrite fetch
overwriteFetch();

// For more options see below
app.use(VueReCaptcha, {
	siteKey: "6LcpnaEfAAAAABlZfJ_rRIBUTgCuJHPRKNmm9768",
});

clickOutsideDirective(app);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");

// Update userdata!
useUserStore()
	.getUserData()
	.catch((e) => {
		console.error("Something went wrong with getting userdata");
	});
