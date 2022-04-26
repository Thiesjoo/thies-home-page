declare global {
	interface Window {
		networking: {
			currentlyLoadingRequests: number;
			failedFetches: number;
			failedRequests: number;
			authenticated: boolean;
		};
		env: {
			VUE_APP_VERCEL_ENV: "production" | "preview" | "development";
			VUE_APP_VERCEL_URL: string;
			VUE_APP_VERCEL_GIT_COMMIT_SHA: string;
			VUE_APP_VERCEL_GIT_COMMIT_MESSAGE: string;
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
	faLock,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { clickOutsideDirective } from "./helpers/clickOutside";
import "./helpers/auto-refresh-tokens";

import { VueReCaptcha } from "vue-recaptcha-v3";

/** Tailwind shizz */
import "./index.css";

//@ts-ignore
window.env = ENV;
window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA =
	window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA || "PLACEHOLDERAood4vTEZvU";

library.add(faTwitch, faXmark, faLock, faArrowRightFromBracket);

const app = createApp(App, { router });
app.use(router);

// For more options see below
app.use(VueReCaptcha, { siteKey: "6LcpnaEfAAAAABlZfJ_rRIBUTgCuJHPRKNmm9768" });

clickOutsideDirective(app);

app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
