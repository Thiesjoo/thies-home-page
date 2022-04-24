import { VercelRequest, VercelResponse } from "@vercel/node";
import "axios";
import axios from "axios";
import getProviderCredentials from "./_getcredentials";
import { default as ms } from "ms";

export default async function (req: VercelRequest, res: VercelResponse) {
	const result = await getProviderCredentials(req, res, "via");
	if (!result) return;

	let balance = "";
	try {
		if (!result.accessToken) throw new Error("POS Token not available");

		const fetchRes = await axios({
			url: "https://pos.svia.nl/api/account/",
			headers: {
				authorization: "Bearer " + result.accessToken,
			},
			method: "GET",
		});
		balance = fetchRes?.data?.balance;
	} catch (e) {
		if (!e?.message?.startsWith("POS")) {
			//Something went wrong with the POS request, we revoke the token so we don't end up spamming POS
			console.log("POS ERROR: ", e);
			// Wipe the pos access token to prevent
			await axios({
				url: process.env.BASEURL + "/api/providers/me/via/" + result.id,
				params: {
					accessToken: "",
				},
				headers: {
					Authorization: `Bearer ${req.cookies.accesstoken}`,
					"X-Secret": process.env.secret,
				},
				method: "PATCH",
			});
		}
		res.statusCode = 407;
		res.setHeader("Content-Type", "application/json");
		res.json({ error: "POS Creds expired" });
		return;
	}

	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Cache-Control", "max-age=" + (ms("5m") / 1000).toString());
	res.json({ balance });
}
