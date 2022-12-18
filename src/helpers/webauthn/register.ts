import { startRegistration } from "@simplewebauthn/browser";
import axios from "axios";
import { useToast } from "vue-toastification";
import { getBaseURL } from "../auto-refresh-tokens";

/**
 * Resident key is a key that stores the userid.
 * So you can use resident key with or without email.
 *
 * A non resident key can only be used with email.
 * @param residentKey
 */
export async function registerNewToken(nickname: string) {
	const toast = useToast();

	// GET registration options from the endpoint that calls
	// @simplewebauthn/server -> generateRegistrationOptions()
	const resp = await axios.get(getBaseURL() + "/auth/webauthn/generate-registration-options");

	let opts = resp.data;

	opts.authenticatorSelection.residentKey = "required";
	opts.authenticatorSelection.requireResidentKey = true;
	opts.extensions = {
		credProps: true,
	};

	console.log("Data from server combined with options: ", opts);

	let attResp;
	try {
		// Pass the options to the authenticator and wait for a response
		attResp = await startRegistration(opts);
		console.log("Got attresp: ", attResp);
	} catch (error: any) {
		//Check if user already has a token registered
		if (error.name === "InvalidStateError") {
			toast.error("You already have this token registered!");
		}

		console.error("Error inside registerNewToken", error);
		throw error;
	}

	// POST the response to the endpoint that calls
	// @simplewebauthn/server -> verifyRegistrationResponse()
	const verificationResp = await axios.post(getBaseURL() + "/auth/webauthn/verify-registration", {
		...attResp,
		nickname,
		resident: true,
	});

	// Wait for the results of verification
	console.log("Verified token: ", verificationResp);
	toast.success("Registered new token!");
}
