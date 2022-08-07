import { startRegistration } from "@simplewebauthn/browser";

export async function registerNewToken() {
	console.log("hmmm");
	const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
		challenge: Uint8Array.from("hmmmmmmm", (c) => c.charCodeAt(0)),
		rp: {
			name: "Authorium",
			// id: "thies.dev",
		},
		user: {
			id: Uint8Array.from("UZSL85T9AFC", (c) => c.charCodeAt(0)),
			name: "lee@webauthn.guide",
			displayName: "Lee",
		},
		pubKeyCredParams: [
			//https://chromium.googlesource.com/chromium/src/+/master/content/browser/webauth/pub_key_cred_params.md
			{ alg: -7, type: "public-key" },
			{ alg: -257, type: "public-key" },
		],
		authenticatorSelection: {
			authenticatorAttachment: "cross-platform",
			userVerification: "required", //TODO: This is auth so maybe required:https://developers.yubico.com/WebAuthn/WebAuthn_Developer_Guide/User_Presence_vs_User_Verification.html
		},
		timeout: 60000,
		attestation: "direct",
	};

	const credential = await navigator.credentials.create({
		publicKey: publicKeyCredentialCreationOptions,
	});

	console.log(credential);
}
