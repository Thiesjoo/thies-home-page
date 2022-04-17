import { VercelRequest } from "@vercel/node";
import axios from "axios";

export async function getProviderCredentials(
	req: VercelRequest,
	provider: string,
	id?: string
) {
	let token = req.cookies.accesstoken;

	if (!token) {
		throw new Error("PROVIDER: No accesstoken found");
	}

	try {
		const result: {
			id: string;
			accessToken: string;
			expiry: Date;
			refreshToken?: string;
			username?: string;
			avatar?: string;
			scopes?: string[];
			extra?: any;
			clientid: string;
		} = (
			await axios({
				url: process.env.BASEURL + "/api/providers/me/" + provider,
				params: {
					id,
				},
				headers: {
					Authorization: `Bearer ${token}`,
					"X-Secret": process.env.secret,
				},
				method: "GET",
			})
		)?.data;
		return result;
	} catch (e) {
		throw new Error(
			"PROVIDER (myapi): " + e + " msg: " + e?.response?.data?.message
		);
	}
}

export default getProviderCredentials;
