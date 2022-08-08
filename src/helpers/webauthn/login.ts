import { startAuthentication } from "@simplewebauthn/browser";
import axios from "axios";
import { toastInjectionKey, useToast } from "vue-toastification";

export async function loginWithWebAuth(autofill = false) {
	const toast = useToast();
	try {
		const resp = await axios.get("/auth/webauthn/generate-authentication-options");
		const authResult = await startAuthentication(resp.data, autofill);

		console.log("Auth result: ", authResult);

		const authResp = await axios.post("/auth/webauthn/verify-authentication", {
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
