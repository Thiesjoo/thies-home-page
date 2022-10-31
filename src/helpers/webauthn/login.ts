import { startAuthentication } from "@simplewebauthn/browser";
import axios from "axios";
import { useToast } from "vue-toastification";
import { getBaseURL } from "../auto-refresh-tokens";

export async function loginWithEmailAndAuthenticator(email: string) {
	const toast = useToast();
	try {
		const resp = await axios.get(getBaseURL() + "/auth/webauthn/generate-authentication-options-user", {
			params: {
				username: email,
			},
		});
		console.log(resp);
		// const authResult = await startAuthentication(resp.data, false);

		return { access: "granted", refresh: "granted" };
	} catch (e) {
		console.error(e);
		// Check if user cancelled

		// Check if user has no authenticator

		throw e;
	}
}

export async function loginWithPasskey() {
	const toast = useToast();
	try {
		const resp = await axios.get(getBaseURL() + "/auth/webauthn/generate-authentication-options");
		const authResult = await startAuthentication(resp.data, false);

		console.log("Auth result: ", authResult);

		const authResp = await axios.post(getBaseURL() + "/auth/webauthn/verify-authentication", {
			challenge: resp.data.challenge,
			...authResult,
		});

		if (authResp.data) {
			toast.success("Got data from authenticator");
			return authResp.data as { access: string; refresh: string };
		} else {
			throw new Error(authResp.data);
		}
	} catch (e) {
		console.error(e);
		toast.error("Something went wrong!");
		throw e;
	}
}
