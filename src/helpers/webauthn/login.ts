import { startAuthentication } from "@simplewebauthn/browser";
import axios from "axios";
import { useToast } from "vue-toastification";
import { getBaseURL } from "../auto-refresh-tokens";

function toastOnCancel(e: any, toast: ReturnType<typeof useToast>) {
	console.error(e);

	if (e === "User not found") {
		toast.error("User not found");
	} else if (e.message === "The operation was aborted.") {
		toast.error("You cancelled the operation");
	} else if (e.message?.includes("No available authenticator") || e.message === "No authenticators found") {
		toast.error("No authenticator found, please connect one and try again");
	} else if (e.response) {
		// Axios errors
		if (e.response.status === 0) {
			toast.error("Cannot make a connection to the server");
		} else {
			toast.error("Something went wrong on the network");
		}
	} else {
		toast.error("Something went wrong");
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
			return authResp.data as { access: string; refresh: string };
		} else {
			throw new Error(authResp.data);
		}
	} catch (e) {
		toastOnCancel(e, toast);
		throw e;
	}
}
