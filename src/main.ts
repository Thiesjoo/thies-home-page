import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

/* Fontawesome shizz */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faTwitch);

const getURL = () => {
	return window.location.origin.includes("localhost")
		? "http://localhost:6969"
		: "https://auth.thies.dev";
};

const { fetch: originalFetch } = window;

let currentlyFetching: Promise<Response> | null = null;

window.fetch = async (...args) => {
	let [resource, config] = args;

	const response = await originalFetch(resource, config);

	if (response.status === 401) {
		console.warn("Refreshing tokens");
		if (!currentlyFetching) {
			currentlyFetching = originalFetch(getURL() + "/auth/refresh/access", {
				credentials: "include",
			});
		}

		const newResponse = await currentlyFetching;
		if (newResponse.ok) {
			return await originalFetch(resource, config);
		}
	}
	// response interceptor here
	return response;
};

const app = createApp(App, { router });
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
