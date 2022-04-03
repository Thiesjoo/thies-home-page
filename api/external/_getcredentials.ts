import { VercelRequest } from "@vercel/node";
import axios from "axios";

export async function getProviderCreds(req: VercelRequest, provider: string) {
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
				url: process.env.BASEURL + "/api/users/me/providers/" + provider,
				headers: {
					Authorization: `Bearer ${token}`,
					"X-Secret": process.env.secret,
				},
				method: "GET",
			})
		)?.data;
		return result;
	} catch (e) {
		throw new Error("PROVIDER: " + e + " msg: " + e?.response?.data?.message);
	}
}
