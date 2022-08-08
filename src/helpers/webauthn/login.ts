import { startAuthentication } from "@simplewebauthn/browser";
import axios from "axios";

export async function loginWithWebAuth(autofill = false) {
	const resp = await axios.get("/auth/webauthn/generate-authentication-options");

	// resp.data.allowCredentials = resp.data.allowCredentials.map((x: any) => {
	// 	return {
	// 		...x,
	// 		id: decode(x.id),
	// 	};
	// });

	const authResult = await startAuthentication(resp.data, autofill);

	console.log(authResult);
}
