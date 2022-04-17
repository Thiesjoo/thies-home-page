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

window.fetch = async (...args) => {
	let [resource, config] = args;

	const response = await originalFetch(resource, config);

	if (response.status === 401) {
		console.warn("Refreshing tokens");
		if (!currentlyFetching) {
			currentlyFetching = originalFetch(getURL() + "/auth/refresh/access", {
				credentials: "include",
			});
		}

		const newResponse = await currentlyFetching;
		if (newResponse.ok) {
			return await originalFetch(resource, config);
		}
	}
	// response interceptor here
	return response;
};