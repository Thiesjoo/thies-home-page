import { VercelRequest, VercelResponse } from "@vercel/node";
import "axios";
import axios from "axios";

export default async function (req: VercelRequest, res: VercelResponse) {
	const fetchRes = await axios({
		url: "https://pos.svia.nl/api/account/",
		headers: {
			authorization: "Bearer",
		},
		method: "GET",
	});
	// TODO: Figure out how to not spam via ^^
	// const fetchRes = { data: { balance: 1950 } };

	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.json({ balance: fetchRes?.data?.balance });
}
