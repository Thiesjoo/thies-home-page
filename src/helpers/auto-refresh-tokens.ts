import axios from "axios";
import { AxiosAuthRefreshRequestConfig, default as createAuthRefreshInterceptor } from "axios-auth-refresh";

import { useUserStore } from "@/store/user.store";
import { Pinia } from "pinia";

export const getBaseURL = () => {
	return window?.env?.AUTHBASEURL || "https://auth.thies.dev";
};

export const getDeviceBaseURL = () => {
	return window?.env?.DEVICEBASEURL || "https://testing.thies.dev";
};

export function setupRefreshAuth(pinia: Pinia) {
	const userStore = useUserStore(pinia);

	// Function that will be called to refresh authorization
	const refreshAuthLogic: (error: any) => Promise<any> = async (failedRequest) => {
		console.log("Going to refresh");
		try {
			const tokenRefreshResponse = await axios.get(getBaseURL() + "/auth/refresh/access", {
				skipAuthRefresh: true,
			} as AxiosAuthRefreshRequestConfig);
			if (!tokenRefreshResponse.data.token) {
				throw new Error("Refresh went wrong!");
			}
			console.log("New refresh token issued: ", tokenRefreshResponse.data.token);
			userStore.accessToken = tokenRefreshResponse.data.token;
			failedRequest.response.config.headers["Authorization"] = `Bearer ${tokenRefreshResponse.data.token}`;
			return await Promise.resolve();
		} catch (e) {
			throw e;
		}
	};

	// Instantiate the interceptor
	createAuthRefreshInterceptor(axios, refreshAuthLogic, {
		shouldRefresh: (error) => {
			// 401, but not on "local/login"
			return (
				error.response?.status === 401 &&
				!(
					!!error.config.url?.includes("local/login") ||
					!!error.config.url?.includes("local/register") ||
					!!error.config.url?.includes("logout") ||
					!!error.config.url?.includes("authentication")
				)
			);
		},
	});

	axios.interceptors.request.use((request) => {
		// If you make changes to window api, you can also change every request after that
		if (!request.baseURL) {
			request.baseURL = getBaseURL();
		}
		if (!request.headers) {
			request.headers = {};
		}

		if (!request.url?.includes("access") && !request.headers["Authorization"] && userStore.accessToken) {
			request.headers["Authorization"] = `Bearer ${userStore.accessToken}`;
		}

		// Never cache API requests going to thies.dev, because something weird is going on with caching CORS URL's
		if (
			// Actually going to thies.dev domain
			(request.url?.includes("thies.dev") ||
				// Axios shortcut. If you do not specify a domain, it will use the baseURL
				(request.baseURL?.includes("thies.dev") && !request.url?.includes("http"))) &&
			// We ALWAYS want to cache the rooster_parser, because it is a static file
			!request.url?.includes("rooster_parser")
		) {
			request.headers["pragma"] = "no-cache";
			request.headers["cache-control"] = "no-cache";
		}

		return request;
	});

	axios.interceptors.response.use(
		function (response) {
			return response;
		},
		function (error) {
			if (!window.navigator.onLine && !error.response && error.code === "ERR_NETWORK") {
				alert("no internet connection");
			}
			return Promise.reject(error?.response?.data?.message || error);
		}
	);

	axios.defaults.withCredentials = true;
}

//TODO: Spotify accesstoken expiry error
