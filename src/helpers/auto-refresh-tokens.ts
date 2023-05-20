import axios from "axios";
import { AxiosAuthRefreshRequestConfig, default as createAuthRefreshInterceptor } from "axios-auth-refresh";

import { Pinia } from "pinia";

export const getBaseURL = () => {
	return window?.env?.AUTHBASEURL || "https://auth.thies.dev";
};

export const getDeviceBaseURL = () => {
	return window?.env?.DEVICEBASEURL || "https://testing.thies.dev";
};

export function setupRefreshAuth(pinia: Pinia) {
	axios.interceptors.request.use((request) => {
		// If you make changes to window api, you can also change every request after that
		if (!request.baseURL) {
			request.baseURL = getBaseURL();
		}
		if (!request.headers) {
			request.headers = {};
		}

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
