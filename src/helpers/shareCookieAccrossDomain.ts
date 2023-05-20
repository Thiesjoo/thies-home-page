import CookieInterceptor from "cookie-interceptor";
CookieInterceptor.init();

CookieInterceptor.write.use(function (cookie) {
	const [cookieValue, props] = cookie.split(";");

	try {
		const [key, val] = cookieValue.split(" = ");

		if (key === "psg_auth_token" && val !== "") {
			const currentDomain = window.location.hostname;
			const domainProp = `domain=${currentDomain}`;

			const toReturn = `${cookieValue}; ${domainProp}`;
			console.warn("Overwriting cookie to include new domain");
			return toReturn;
		}
	} catch (e) {}

	return cookie;
});
