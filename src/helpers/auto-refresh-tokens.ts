import axios from "axios";
import { Passage } from "@passageidentity/passage-js";
import { Pinia } from "pinia";
import * as Sentry from "@sentry/vue";

export const getBaseURL = () => {
	return window?.env?.AUTHBASEURL || "https://auth.thies.dev";
};

export const getDeviceBaseURL = () => {
	return window?.env?.DEVICEBASEURL || "https://testing.thies.dev";
};

let currentRefresh: Promise<string> | null = null;

export function setupRefreshAuth(pinia: Pinia) {
	axios.interceptors.request.use(async (request) => {
		// If you make changes to window api, you can also change every request after that
		if (!request.baseURL) {
			request.baseURL = getBaseURL();
		}
		if (!request.headers) {
			request.headers = {};
		}

		const passage = new Passage(window.env.PASSAGE_APP_ID);

		let token;
		try {
			if (currentRefresh) {
				Sentry.captureMessage("Waiting on pending refresh token");
				token = await currentRefresh;
			} else {
				currentRefresh = passage.getCurrentSession().getAuthToken();
				Sentry.captureMessage("Getting new refresh token");
				token = await currentRefresh;
				currentRefresh = null;
			}
		} catch (e) {
			Sentry.captureException(e);
			console.error(e);
			throw e;
		}

		request.headers.Authorization = `Bearer ${token}`;

		// // Never cache API requests going to thies.dev, because something weird is going on with caching CORS URL's
		// if (
		// 	// Actually going to thies.dev domain
		// 	(request.url?.includes("thies.dev") ||
		// 		// Axios shortcut. If you do not specify a domain, it will use the baseURL
		// 		(request.baseURL?.includes("thies.dev") && !request.url?.includes("http"))) &&
		// 	// We ALWAYS want to cache the rooster_parser, because it is a static file
		// 	!request.url?.includes("rooster_parser")
		// ) {
		// 	request.headers["pragma"] = "no-cache";
		// 	request.headers["cache-control"] = "no-cache";
		// }

		return request;
	});

	axios.defaults.withCredentials = true;
}
