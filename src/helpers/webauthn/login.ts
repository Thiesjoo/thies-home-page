import { startAuthentication } from "@simplewebauthn/browser";
import axios from "axios";
import { useToast } from "vue-toastification";
import { getBaseURL } from "../auto-refresh-tokens";

export async function loginWithWebAuth(autofill = false) {
	const toast = useToast();
	try {
		const resp = await axios.get(getBaseURL() + "/auth/webauthn/generate-authentication-options");
		const authResult = await startAuthentication(resp.data, autofill);

		console.log("Auth result: ", authResult);

		const authResp = await axios.post(getBaseURL() + "/auth/webauthn/verify-authentication", {
			// We send the challenge we signed back: https://antony.cloud/posts/en/webauthn/`
			challenge: resp.data.challenge,
			...authResult,
		});

		if (authResp.data) {
			toast.success("Got data from authenticator");
		} else {
			throw new Error(authResp.data);
		}
	} catch (e) {
		console.error(e);
		toast.error("Something went wrong!");
	}
}
