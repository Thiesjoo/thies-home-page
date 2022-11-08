//@ts-ignore This constant is inserted by webpack in vue.config.js
window.env = ENV;
window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA = window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA || "PLACEHOLDERAood4vTEZvU";
window.env.VUE_APP_VERCEL_ENV = window.env.VUE_APP_VERCEL_ENV || "development";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

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
	faEthernet,
	faHourglass,
	faLaptop,
	faLinkSlash,
	faLock,
	faMobile,
	faPlaneUp,
	faPlus,
	faRobot,
	faScroll,
	faServer,
	faSignal,
	faTrash,
	faWifi,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";

import "./helpers/auto-refresh-tokens";
import { clickOutsideDirective } from "./helpers/clickOutside";

import { VueReCaptcha } from "vue-recaptcha-v3";

/** Tailwind shizz */
import "./index.css";

import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { getBaseURL } from "./helpers/auto-refresh-tokens";
import { useUserStore } from "./store/user.store";

import axios from "axios";
axios.defaults.baseURL = getBaseURL();

library.add(faTwitch, faSpotify, faDiscord, faGithub);
library.add(faXmark, faLock, faArrowRightFromBracket, faBolt, faLinkSlash, faPlus, faTrash);
//Home page
library.add(faRobot, faScroll, faServer, faMobile, faDesktop, faLaptop);

library.add(faPlaneUp, faEthernet, faWifi, faSignal, faHourglass, faBattery, faArrowsRotate);

const app = createApp(App, { router });
app.use(router);

app.use(createPinia());
app.use(Toast, {});

// For more options see below
app.use(VueReCaptcha, {
	siteKey: "6LcpnaEfAAAAABlZfJ_rRIBUTgCuJHPRKNmm9768",
});

clickOutsideDirective(app);

app.component("font-awesome-icon", FontAwesomeIcon);

if (/\blinux\b/i.test(navigator.userAgent)) {
	document.body.className += " linux";
}

app.mount("#app");

// Update userdata!
useUserStore()
	.getUserData()
	.catch((e) => {
		console.error("Something went wrong with getting userdata");
	});

// Watch the store for changes, and when a user logs out, redirect to the login page if on auth-required page
useUserStore().$subscribe((mut, state) => {
	if (!state.loggedIn && router.currentRoute.value.meta.requiresLogin) {
		router.push("/login?to=" + router.currentRoute.value.path);
	}
});
