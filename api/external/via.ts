import { VercelRequest, VercelResponse } from "@vercel/node";
import "axios";
import axios from "axios";
import { getProviderCredentials } from "./_getcredentials";
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
	} catch (e: any) {
		if (!e?.message?.startsWith("POS")) {
			//Something went wrong with the POS request, we revoke the token so we don't end up spamming POS
			console.log("EXTERNAL ERROR: ", e);
			try {
				console.log("Deleting pos token");
				await axios({
					url: process.env.BASEURL + "/api/providers/me/via/" + result.id,
					headers: {
						Authorization: `Bearer ${
							req.cookies.accesstoken || req.headers.authorization?.split(" ")?.[1]
						}`,
						"X-Secret": process.env.secret || "",
					},
					data: {
						accessToken: "",
					},
					method: "PATCH",
				});
			} catch (e) {
				console.error("Something went wrong with deleting token", e);
				res.setHeader("fail_location", "auth.thies.dev");
			}
		}
		res.statusCode = 403;
		res.setHeader("Content-Type", "application/json");
		res.json({ error: "POS accesstoken is either expired, or non existent" });
		return;
	}

	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Cache-Control", "max-age=" + (ms("5m") / 1000).toString());
	res.json({ balance });
}
