import { VercelRequest, VercelResponse } from "@vercel/node";
import "axios";
import axios from "axios";
import getProviderCredentials from "./_getcredentials";

export default async function (req: VercelRequest, res: VercelResponse) {
	const result = await getProviderCredentials(req, "via");

	const fetchRes = await axios({
		url: "https://pos.svia.nl/api/account/",
		headers: {
			authorization: "Bearer " + result.accessToken,
		},
		method: "GET",
	});

	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.json({ balance: fetchRes?.data?.balance });
}
