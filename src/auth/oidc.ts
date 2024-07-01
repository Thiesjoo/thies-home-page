import { User, UserManager, WebStorageStateStore } from "oidc-client-ts";
import { AuthMethod } from ".";
import { UserFromAPI } from "@/helpers/types/user";
import { useToast } from "vue-toastification";

const userManager = new UserManager({
	authority: `${import.meta.env.VITE_OIDC_AUTHORITY}`,
	client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
	redirect_uri: `${window.location.origin}/login/callback`,
    silent_redirect_uri: `${window.location.origin}/login/silent-callback`,
	response_type: "code",
	scope: "openid profile email settings spotify-access offline_access",
	userStore: new WebStorageStateStore({ store: window.localStorage }),
	monitorSession: true,
	monitorAnonymousSession: true,
});

//@ts-ignore
window.test = userManager;

function popup(): Promise<void> {
	return new Promise((resolve, reject) => {
		userManager
			.signinPopup()
			.then(async (user) => {
				console.log("User signed in", user);
				resolve();
			})
			.catch((err) => {
				const toast = useToast();
				toast.error("Something went wrong while logging in!");
				console.error(err);
				reject(err);
			});
	});
}

export function callback() {
	userManager.signinPopupCallback().then(() => {
		console.log("CALLBACK: User signed in!");
	});
}

export function silentCallback() {
    userManager.signinSilentCallback().then(() => {
        console.log('SILENT CALLBACK: User signed in!')
    })
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

async function getUser(fullRefresh = false): Promise<UserFromAPI | null> {
	let tempuser: null | User = null;
    try {
        tempuser = await userManager.getUser();
    } catch(e) {
        console.error("Failed to get user: ", e);
    }

	if (!tempuser) {
		console.warn("Getting user, but user is null");
		return null;
	}

	if (fullRefresh) {
		tempuser = await userManager.signinSilent();
		if (!tempuser) {
			console.log("Full refresh failed, returning null");
			return null;
		}
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
			widgetsAvailable: [],
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
	console.log("Registering callbacks inside oidc service!");
	userManager.events.addUserLoaded(async () => {
		console.log("User signed in event, passing through to callback!");
		const user = await getUser();
		if (user) {
			signedInCallback(user);
		} else {
			throw new Error("User is null when signed in!");
		}
	});
	userManager.events.addUserSignedOut(() => {
		signedOutCallback();
	});
}

async function logout() {
	await userManager.signoutRedirect();
}

function getHostFromAuthority() {
	const url = new URL(import.meta.env.VITE_OIDC_AUTHORITY);
	return url.host;
}

export default {
	getURLToShowUser: getHostFromAuthority,
	getUser,
	getToken,
	logout,
	registerCallbacks,
	startAuthentication: popup,
} satisfies AuthMethod;
