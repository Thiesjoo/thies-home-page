import { UserManager } from "oidc-client-ts";

const userManager = new UserManager({
	authority: "https://authentik.thies.dev/application/o/thies-home-page/",
	client_id: "thies-home-page",
	redirect_uri: "http://localhost:3000/",
	response_type: "code",
	scope: "openid profile email settings",
});

export function popup() {
	userManager.signinPopup().then(async (user) => {
		console.log("User signed in", user);
		console.log(await userManager.getUser());
		const access = user.access_token;
		const resp = await fetch("https://authentik.thies.dev/application/o/userinfo/", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${access}`,
			},
		});
		const data = await resp.json();
		console.log(data);
	});
}

export function callback() {
	userManager.signinPopupCallback().then((user) => {
		console.log("CALLBACK: User signed in", user);
	});
}
