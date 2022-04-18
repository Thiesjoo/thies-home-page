// This file overwrites fetch, and watches for 401 errors.
// IF there is an 401 error, we try to refresh the token.

//TODO: Implement something that prevents refresh spamming on invalid token

const getURL = () => {
	return window.location.origin.includes("localhost")
		? "http://localhost:6969"
		: "https://auth.thies.dev";
};

const { fetch: originalFetch } = window;

let currentlyFetching: Promise<Response> | null = null;
window.networking = {
	currentlyLoadingRequests: 0,
	failedFetches: 0,
	authenticated: true,
};

window.fetch = async (...args) => {
	let [resource, config] = args;

	window.networking.currentlyLoadingRequests++;
	window.dispatchEvent(new Event("currentlyLoadingRequests"));

	try {
		const response = await originalFetch(resource, config);

		if (response.status === 401 && window.networking.authenticated) {
			console.warn("Refreshing tokens");
			if (!currentlyFetching) {
				currentlyFetching = originalFetch(getURL() + "/auth/refresh/access", {
					credentials: "include",
				});
			}
			try {
				const newResponse = await currentlyFetching;
				if (newResponse.ok) {
					window.networking.authenticated = true;

					const resp = await originalFetch(resource, config);
					window.networking.currentlyLoadingRequests--;
					window.dispatchEvent(new Event("currentlyLoadingRequests"));

					return resp;
				} else {
					throw new Error("catch this MWUAHAHAH");
				}
			} catch (e) {
				window.networking.authenticated = false;
				window.networking.failedFetches++;
				throw new Error("Something went wrong with refreshing the tokens");
			}
		}

		window.networking.currentlyLoadingRequests--;
		window.dispatchEvent(new Event("currentlyLoadingRequests"));

		return response;
	} catch (e) {
		window.networking.failedFetches++;
		window.networking.currentlyLoadingRequests--;
		window.dispatchEvent(new Event("currentlyLoadingRequests"));
		throw e;
	}
};
