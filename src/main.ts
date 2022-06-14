import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

/* Fontawesome shizz */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faTwitch, faDiscord, faSpotify } from "@fortawesome/free-brands-svg-icons";
import {
	faArrowRightFromBracket,
	faBolt,
	faLinkSlash,
	faLock,
	faPlus,
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

//@ts-ignore This constant is inserted by webpack in vue.config.js
window.env = ENV;
window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA = window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA || "PLACEHOLDERAood4vTEZvU";

library.add(faTwitch, faSpotify, faDiscord);
library.add(faXmark, faLock, faArrowRightFromBracket, faBolt, faLinkSlash, faPlus);

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
