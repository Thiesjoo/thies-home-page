import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import axios from "axios";
import { decode } from "base64-arraybuffer";

export async function registerNewToken() {
	// GET registration options from the endpoint that calls
	// @simplewebauthn/server -> generateRegistrationOptions()
	const resp = await axios.get("/auth/webauthn/generate-registration-options");
	let attResp;
	try {
		// Pass the options to the authenticator and wait for a response
		attResp = await startRegistration(resp.data);
	} catch (error) {
		throw error;
	}

	// POST the response to the endpoint that calls
	// @simplewebauthn/server -> verifyRegistrationResponse()
	const verificationResp = await axios.post("/auth/webauthn/verify-registration", attResp);

	// Wait for the results of verification
	console.log(verificationResp);
}
