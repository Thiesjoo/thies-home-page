// This file overwrites fetch, and watches for 401 errors.
// IF there is an 401 error, we try to refresh the token.

export const getBaseURL = () => {
	return window.location.origin.includes("localhost")
		? "http://localhost:6969"
		: "https://auth.thies.dev";
};

const { fetch: originalFetch } = window;

/** Current refresh fetch */
let currentlyFetching: Promise<Response> | null = null;

window.networking = {
	currentlyLoadingRequests: 0,
	failedFetches: 0,
	failedRequests: 0,
	authenticated: true,
};

async function refreshTokens() {
	if (!currentlyFetching) {
		currentlyFetching = originalFetch(getBaseURL() + "/auth/refresh/access", {
			credentials: "include",
		});
	}
	try {
		const newResponse = await currentlyFetching;
		if (newResponse.ok) {
			// We've acquired new tokens
			currentlyFetching = null;
			window.networking.authenticated = true;
			return true;
		} else {
			throw new Error(await newResponse.json());
		}
	} catch (e) {
		window.networking.authenticated = false;
		window.networking.failedFetches++;
		throw new Error(
			"Something went wrong with refreshing the tokens. Error: " + e
		);
	}
}

const pendingRequest = (done: boolean) => {
	window.networking.currentlyLoadingRequests += done ? -1 : 1;
	window.dispatchEvent(new Event("currentlyLoadingRequests"));
};

window.fetch = async (...args) => {
	let [resource, config] = args;

	pendingRequest(false);

	try {
		const response = await originalFetch(resource, config);

		if (response.status === 401 && window.networking.authenticated) {
			if (typeof resource == "string" && resource.includes("local/login")) {
				console.log("Login request, not refreshing tokens");
				return response;
			}
			console.warn("Refreshing tokens");

			await refreshTokens();

			// Retry original request when we've acquired new tokens
			const resp = await originalFetch(resource, config);
			pendingRequest(true);
			return resp;
		}

		pendingRequest(true);

		return response;
	} catch (e) {
		window.networking.failedFetches++;
		pendingRequest(true);

		throw e;
	}
};
