import axios from "axios";
import { Passage } from "@passageidentity/passage-js";
import { Pinia } from "pinia";

export const getBaseURL = () => {
	return window?.env?.AUTHBASEURL || "https://auth.thies.dev";
};

export const getDeviceBaseURL = () => {
	return window?.env?.DEVICEBASEURL || "https://testing.thies.dev";
};

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
		request.headers.Authorization = `Bearer ${await passage.getCurrentSession().getAuthToken()}`;

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

//TODO: Spotify accesstoken expiry error
