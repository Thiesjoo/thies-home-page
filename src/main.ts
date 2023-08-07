window.env = {
	VUE_APP_VERCEL_ENV: import.meta.env.VITE_VERCEL_ENV || "development",
	VUE_APP_VERCEL_URL: import.meta.env.VITE_VERCEL_URL || "PLACEHOLDER",
	VUE_APP_VERCEL_GIT_COMMIT_SHA: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA || "PLACEHOLDERPLACEHOLDER",
	VUE_APP_VERCEL_GIT_COMMIT_MESSAGE:
		import.meta.env.VITE_VERCEL_GIT_COMMIT_MESSAGE || "PLACEHOLDERPLACEHOLDERPLACEHOLDER",
	AUTHBASEURL: import.meta.env.VITE_AUTHBASEURL || "https://auth.thies.dev",
	DEVICEBASEURL: import.meta.env.VITE_DEVICEBASEURL || "https://testing.thies.dev",
	PASSAGE_APP_ID: import.meta.env.VITE_PASSAGE_APP_ID || "DIDNTSETAPPID",
};

window.openModals = 0;
import "./helpers/shareCookieAccrossDomain";

import { createApp } from "vue";
import App from "./App.vue";
import router, { enableLogoutWatching } from "./router";

/* Fontawesome shizz */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faDiscord, faGithub, faSpotify, faTwitch } from "@fortawesome/free-brands-svg-icons";
import {
	faArrowRightFromBracket,
	faArrowsRotate,
	faBattery,
	faBolt,
	faDesktop,
	faEdit,
	faEthernet,
	faFingerprint,
	faHourglass,
	faKey,
	faLaptop,
	faLinkSlash,
	faLock,
	faMobile,
	faPlaneUp,
	faPlus,
	faQuestion,
	faRobot,
	faScroll,
	faServer,
	faSignal,
	faTrash,
	faWifi,
	faXmark,
	faBan,
	faHouseSignal,
	faStar,
	faPlay,
	faBackward,
	faForward,
	faPause,
} from "@fortawesome/free-solid-svg-icons";

import { clickOutsideDirective } from "./helpers/clickOutside";

/** Tailwind shizz */
import "./index.css";

import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { enableAuth, enableSettingWatching, useUserStore } from "./store/user.store";

import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

import axios from "axios";
import ModalVue from "./components/Modal.vue";

import { getBaseURL, setupRefreshAuth } from "./helpers/auto-refresh-tokens";
axios.defaults.baseURL = getBaseURL();
setupRefreshAuth();

library.add(faTwitch, faSpotify, faDiscord, faGithub);
library.add(
	faPlaneUp,
	faEthernet,
	faWifi,
	faSignal,
	faHourglass,
	faFingerprint,
	faBattery,
	faArrowsRotate,
	faQuestion,
	faKey,
	faEdit,
	faXmark,
	faLock,
	faArrowRightFromBracket,
	faBolt,
	faLinkSlash,
	faPlus,
	faTrash,
	faRobot,
	faScroll,
	faServer,
	faMobile,
	faDesktop,
	faLaptop,
	faBan,
	faHouseSignal,
	faStar,
	faPlay,
	faBackward,
	faForward,
	faPause
);

const app = createApp(App, { router });

Sentry.init({
	app,
	dsn: "https://6cedfceff1414c40a3850e36e6302816@o4504384319258624.ingest.sentry.io/4504384441417728",
	integrations: [
		new BrowserTracing({
			routingInstrumentation: Sentry.vueRouterInstrumentation(router),
			tracePropagationTargets: ["localhost", "thies.dev", /^\//],
		}),
	],
	tracesSampleRate: 0.5,
	environment: window.env.VUE_APP_VERCEL_ENV,
	enabled: window.env.VUE_APP_VERCEL_ENV !== "development",
	release: "thies-home-page@" + window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA,
});

app.use(router);

const piniaInstance = createPinia();
app.use(piniaInstance);
app.use(Toast, {});

clickOutsideDirective(app);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("Modal", ModalVue);

if (/\blinux\b/i.test(navigator.userAgent)) {
	document.body.className += " linux";
}

app.mount("#app");

console.log("App mounted!");

enableAuth();
useUserStore().getUserData();
enableLogoutWatching();
