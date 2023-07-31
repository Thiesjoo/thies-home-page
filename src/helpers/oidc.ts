import { UserManager } from "oidc-client-ts";

const userManager = new UserManager({
	authority: "https://authentik.thies.dev/application/o/thies-home-page/",
	client_id: "thies-home-page",
	redirect_uri: "http://localhost:3000/",
	response_type: "code",
	scope: "openid profile email settings goauthentik.io/api",
});

export function popup() {
	userManager.signinPopup().then((user) => {
		console.log("User signed in", user);
	});
}

export function callback() {
	userManager.signinPopupCallback().then((user) => {
		console.log("User signed in", user);
	});
}
