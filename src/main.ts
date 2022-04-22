declare global {
	interface Window {
		networking: {
			currentlyLoadingRequests: number;
			failedFetches: number;
			failedRequests: number;
			authenticated: boolean;
		};
		testing123: boolean;
	}
}

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

/* Fontawesome shizz */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "./helpers/auto-refresh-tokens";

/** Tailwind shizz */
import "./index.css";

library.add(faTwitch);

const app = createApp(App, { router });
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
