import { useUserStore } from "@/store/user.store";
import axios from "axios";
import { AxiosAuthRefreshRequestConfig, default as createAuthRefreshInterceptor } from "axios-auth-refresh";

export const getBaseURL = () => {
	return window?.env?.BASEURL || "https://auth.thies.dev";
};

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
		const userStore = useUserStore();
		userStore.accessToken = tokenRefreshResponse.data.token;
		failedRequest.response.config.headers["Authorization"] = "Bearer " + tokenRefreshResponse.data.token;
		return await Promise.resolve();
	} catch (e) {
		console.error(e);
		throw e;
	}
};

// Instantiate the interceptor
createAuthRefreshInterceptor(axios, refreshAuthLogic, {
	shouldRefresh: (error) => {
		// 401, but not on "local/login"
		return (
			error.response?.status === 401 &&
			!(!!error.config.url?.includes("local/login") || !!error.config.url?.includes("local/register"))
		);
	},
});

axios.interceptors.request.use((request) => {
	const userStore = useUserStore();
	if (!request.headers) {
		request.headers = {};
	}

	if (!request.headers["Authorization"] && userStore.accessToken) {
		request.headers["Authorization"] = `Bearer ${userStore.accessToken}`;
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
axios.defaults.baseURL = getBaseURL();

//TODO: network error interceptor
//TODO: Spotify accesstoken expiry error
