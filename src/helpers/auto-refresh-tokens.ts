import { useUserStore } from "@/store/user.store";
import axios from "axios";
import { AxiosAuthRefreshRequestConfig, default as createAuthRefreshInterceptor } from "axios-auth-refresh";

export const getBaseURL = () => {
	return window?.env?.AUTHBASEURL || "https://auth.thies.dev";
};

export const getDeviceBaseURL = () => {
	return window?.env?.DEVICEBASEURL || "https://testing.thies.dev";
};

// Function that will be called to refresh authorization
const refreshAuthLogic: (error: any) => Promise<any> = async (failedRequest) => {
	console.log("Going to refresh");
	try {
		const tokenRefreshResponse = await axios.get(getBaseURL() + "/auth/refresh/access", {
			skipAuthRefresh: true,
			headers: {
				Authorization: "Bearer " + useUserStore().refreshToken,
			},
		} as AxiosAuthRefreshRequestConfig);
		if (!tokenRefreshResponse.data.token) {
			throw new Error("Refresh went wrong!");
		}
		const userStore = useUserStore();
		userStore.accessToken = tokenRefreshResponse.data.token;
		failedRequest.response.config.headers["Authorization"] = "Bearer " + tokenRefreshResponse.data.token;
		return await Promise.resolve();
	} catch (e) {
		// console.error("WIPING USER STATE BECAUSE REFRESH WENT WRONG: ", e);
		// const userStore = useUserStore();
		// window.localStorage.clear();
		// userStore.$reset();
		// console.log(userStore.user);
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
				!!error.config.url?.includes("authentication") ||
				!!error.config.url?.includes("via") ||
				!!error.config.url?.includes("logout")
			)
		);
	},
});

axios.interceptors.request.use((request) => {
	// If you make changes to window api, you can also change every request after that
	if (!request.baseURL) {
		request.baseURL = getBaseURL();
	}
	const userStore = useUserStore();
	if (!request.headers) {
		request.headers = {};
	}

	// Do not include auth headers when refreshing tokens
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
		console.info("Including anti-caching header because CORS and Vercel and multiple domains do not work together");
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
		return Promise.reject(error?.response?.data?.message || error);
	}
);

axios.defaults.withCredentials = true;

//TODO: network error interceptor
//TODO: Spotify accesstoken expiry error
