// This file overwrites fetch, and watches for 401 errors.
// IF there is an 401 error, we try to refresh the token.

import { useUserStore } from "@/store/user.store";

export const getBaseURL = () => {
	return window.env.BASEURL || "https://auth.thies.dev";
};

const { fetch: originalFetch } = window;
export class Interrupted extends Error {}

/** Current refresh fetch */
let currentlyFetching: Promise<Response> | null = null;

async function refreshTokens(store: ReturnType<typeof useUserStore>) {
	if (!currentlyFetching) {
		currentlyFetching = originalFetch(getBaseURL() + "/auth/refresh/access", {
			credentials: "include",
		});
	}

	return new Promise(async (resolve, reject) => {
		try {
			const newResponse = await currentlyFetching;

			if (!newResponse) {
				throw Error("UNREACHABLE");
			}

			if (newResponse.ok) {
				// We've acquired new tokens
				const newTokens = await newResponse.json();
				currentlyFetching = null;

				store.accessToken = newTokens.token;

				resolve(newTokens);
			} else {
				reject(await newResponse.json());
			}
		} catch (e: any) {
			console.error("network error refresh: ", e);
			throw new Interrupted(e?.message);
		}
	});
}

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

// TODO: This requires a better rework to stay uncluttered

export function overwriteFetch() {
	const userStore = useUserStore();

	window.fetch = async (...args) => {
		return new Promise(async (resolve, reject) => {
			try {
				let [resource, config] = args;

				const response = await originalFetch(resource, constructConfig(config, userStore.accessToken));

				if (response.status === 401 && userStore.loggedIn) {
					if (typeof resource == "string" && resource.includes("local/login")) {
						console.log("Login request, not refreshing tokens");
						resolve(response);
					}
					console.warn("Refreshing tokens");

					try {
						await refreshTokens(userStore);
					} catch (e) {
						if (e instanceof Interrupted) {
							console.error("Request was interrupted, not modifying state");
							throw e;
						}

						console.warn("Token refresh went wrong! Now logging you out!");
						userStore.logout();
						reject(new Error("No valid refresh token"));
						return;
					}

					// Retry original request when we've acquired new tokens
					const resp = await originalFetch(resource, constructConfig(config, userStore.accessToken));

					if (!resp.ok) {
						reject(new Error(response.statusText));
					}

					resolve(resp);
				}

				if (!response.ok) {
					reject(new Error(response.statusText));
				}

				resolve(response);
			} catch (e: any) {
				console.error("Network error", e);
				throw new Interrupted(e?.message);
			}
		});
	};
}
