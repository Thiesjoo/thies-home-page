import axios from "axios";
import { Passage } from "@passageidentity/passage-js";
import * as Sentry from "@sentry/vue";

export const getBaseURL = () => {
	return window?.env?.AUTHBASEURL || "https://auth.thies.dev";
};

export const getDeviceBaseURL = () => {
	return window?.env?.DEVICEBASEURL || "https://testing.thies.dev";
};

let currentRefresh: Promise<string> | null = null;

export function setupRefreshAuth() {
	axios.interceptors.request.use(async (request) => {
		// If you make changes to window api, you can also change every request after that
		if (!request.baseURL) {
			request.baseURL = getBaseURL();
		}
		if (!request.headers) {
			request.headers = {};
		}

		if (request.url?.includes("thies.dev")) {
			const passage = new Passage(window.env.PASSAGE_APP_ID);

			let token;
			try {
				if (currentRefresh) {
					Sentry.captureMessage("Waiting on pending refresh token");
					token = await currentRefresh;
				} else {
					currentRefresh = passage.getCurrentSession().getAuthToken();
					Sentry.captureMessage("Fetching new tkn from passage");
					token = await currentRefresh;
					Sentry.captureMessage(
						`tkn local has length: ${localStorage.getItem("psg_refresh_token")?.length}, tkn here ${
							token?.length
						}`
					);
					currentRefresh = null;
					document.cookie = `psg_auth_token=${token}; path=/; domain=.${window.location.hostname}; Secure; `;
				}
			} catch (e) {
				Sentry.captureException(e);
				console.error(e);
				throw e;
			}

			request.headers.Authorization = `Bearer ${token}`;
		}

		return request;
	});

	axios.defaults.withCredentials = true;
}
