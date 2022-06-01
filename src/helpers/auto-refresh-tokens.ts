// This file overwrites fetch, and watches for 401 errors.
// IF there is an 401 error, we try to refresh the token.

import { useUserStore } from "@/store/user.store";
import { windowEvent } from "./constants";

export const getBaseURL = () => {
	return window.env.BASEURL || "https://auth.thies.dev";
};

const { fetch: originalFetch } = window;

/** Current refresh fetch */
let currentlyFetching: Promise<Response> | null = null;

window.networking = {
	currentlyLoadingRequests: 0,
	failedFetches: 0,
	failedRequests: 0,
};

async function refreshTokens(store: ReturnType<typeof useUserStore>) {
	if (!currentlyFetching) {
		currentlyFetching = originalFetch(getBaseURL() + "/auth/refresh/access", {
			credentials: "include",
		});
	}

	try {
		const newResponse = await currentlyFetching;
		if (newResponse.ok) {
			// We've acquired new tokens
			const newTokens = await newResponse.json();
			currentlyFetching = null;

			store.accessToken = newTokens.token;

			return newTokens;
		} else {
			throw new Error(await newResponse.json());
		}
	} catch (e) {
		window.networking.failedFetches++;
		throw new Error("Something went wrong with refreshing the tokens. Error: " + e);
	}
}

const pendingRequest = (done: boolean) => {
	window.networking.currentlyLoadingRequests += done ? -1 : 1;
	window.dispatchEvent(new Event(windowEvent));
};

function constructConfig(config: RequestInit | undefined, token: string) {
	if (!token) return config;

	return {
		...config,
		headers: {
			Authorization: "Bearer " + token,
			...config?.headers,
		},
	};
}

export function overwriteFetch() {
	const userStore = useUserStore();

	window.fetch = async (...args) => {
		let [resource, config] = args;

		pendingRequest(false);

		try {
			const response = await originalFetch(resource, constructConfig(config, userStore.accessToken));

			if (response.status === 401 && userStore.loggedIn) {
				if (typeof resource == "string" && resource.includes("local/login")) {
					console.log("Login request, not refreshing tokens");
					return response;
				}
				console.warn("Refreshing tokens");

				await refreshTokens(userStore);

				// Retry original request when we've acquired new tokens
				const resp = await originalFetch(resource, constructConfig(config, userStore.accessToken));

				pendingRequest(true);
				if (!resp.ok) {
					throw Error(response.statusText);
				}
				return resp;
			}

			pendingRequest(true);

			if (!response.ok) {
				throw Error(response.statusText);
			}

			return response;
		} catch (e) {
			window.networking.failedFetches++;
			pendingRequest(true);

			throw e;
		}
	};
}
