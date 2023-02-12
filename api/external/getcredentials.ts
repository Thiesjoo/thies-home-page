import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export async function getProviderCredentials(req: VercelRequest, res: VercelResponse, provider: string, id?: string) {
	let token = req.cookies.accesstoken || req.headers.authorization?.split(" ")?.[1];
	try {
		if (!token) {
			throw new Error("401 - No accesstoken");
		}

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
				url: process.env.VITE_AUTHBASEURL + "/api/providers/me/" + provider,
				params: {
					id,
				},
				headers: {
					Authorization: `Bearer ${token}`,
					"X-Secret": process.env.VITE_secret || "",
				},
				method: "GET",
			})
		)?.data;
		return result;
	} catch (e: any) {
		console.error("PROVIDER (myapi): ", e, " msg: " + e?.response?.data?.message, e?.response?.data);
		res.statusCode = e?.message?.includes("401") ? 401 : 404;
		res.json({
			ok: false,
			errorLocation: "getProviderCredentials",
			error: e?.message,
		});

		return false;
	}
}

export default async function (req: VercelRequest, res: VercelResponse) {
	res.json({ ok: true });
}
