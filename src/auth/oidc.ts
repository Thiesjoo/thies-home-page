import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { AuthMethod } from ".";
import { UserFromAPI } from "@/helpers/types/user";

const userManager = new UserManager({
	authority: "https://authentik.thies.dev/application/o/thies-home-page/",
	client_id: "thies-home-page",
	redirect_uri: "http://localhost:3000/login/callback",
	response_type: "code",
	scope: "openid profile email settings spotify-access",
	userStore: new WebStorageStateStore({ store: window.localStorage }),
	monitorSession: true,
	monitorAnonymousSession: true,
});

//@ts-ignore
window.test = userManager;

export function popup() {
	userManager.signinPopup().then(async (user) => {
		console.log("User signed in", user);
		console.log(await userManager.getUser());
	});
}

export function callback() {
	userManager.signinPopupCallback().then(() => {
		console.log("CALLBACK: User signed in!");
	});
}

function parseBoolean(str: string | boolean | undefined) {
	if (typeof str === "boolean") {
		return str;
	} else if (typeof str === "string") {
		return str === "true" || str === "1" || str === "yes" || str === "Yes";
	} else {
		return false;
	}
}

async function getUser(): Promise<UserFromAPI | null> {
	const tempuser = await userManager.getUser();
	if (!tempuser) {
		return null;
	}

	const prof = tempuser.profile;
	if (!prof || !prof.name || !prof.email || !prof.settings) {
		console.warn("User is missing some data", tempuser);
		return null;
	}
	const settings = prof.settings as {
		[key: string]: string | boolean | undefined;
	};

	const name = prof.name.split(" ");

	const user = {
		name: {
			first: name[0],
			last: name[1],
		},
		email: prof.email,
		settings: {
			showSeconds: parseBoolean(settings.showSeconds),
			showDate: parseBoolean(settings.showDate),
			showVersion: parseBoolean(settings.showVersion),
			showFavorites: parseBoolean(settings.showFavorites),
			backgroundURL: (settings.backgroundURL as string) || "",
		},
	} satisfies UserFromAPI;

	return user;
}

async function getToken() {
	const user = await userManager.getUser();
	if (user) {
		return user.access_token;
	} else {
		return null;
	}
}

function registerCallbacks(signedInCallback: (user: UserFromAPI) => void, signedOutCallback: () => void) {
	console.error("TODO");
}

async function logout() {
	await userManager.signoutRedirect();
}

// userManager.events.addSilentRenewError((e) => {
// 	console.error("Silent renew error", e);
// });

// userManager.events.addUserLoaded((user) => {
// 	console.log("User loaded", user);
// });

// userManager.events.addUserUnloaded(() => {
// 	console.log("User unloaded");
// });

// userManager.events.addUserSignedIn(() => {
// 	console.log("User signed in event!");
// });

// userManager.events.addUserSignedOut(() => {
// 	console.log("User signed out");
// });

export default {
	getUser,
	getToken,
	logout,
	registerCallbacks,
} satisfies AuthMethod;
