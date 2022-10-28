import { startRegistration } from "@simplewebauthn/browser";
import axios from "axios";
import { getBaseURL } from "../auto-refresh-tokens";

export async function registerNewToken() {
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
	} catch (error) {
		console.error("Error inside registerNewToken", error);
		throw error;
	}

	// POST the response to the endpoint that calls
	// @simplewebauthn/server -> verifyRegistrationResponse()
	const verificationResp = await axios.post(getBaseURL() + "/auth/webauthn/verify-registration", attResp);

	// Wait for the results of verification
	console.log("Verified token: ", verificationResp);
}
