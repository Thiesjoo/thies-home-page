import { VercelRequest, VercelResponse } from "@vercel/node";
import "axios";
import axios from "axios";
import { getProviderCreds } from "./_getcredentials";

export default async function (req: VercelRequest, res: VercelResponse) {
	try {
		const result = await getProviderCreds(req, "twitch");

		const twitch = await axios({
			url: "https://api.twitch.tv/helix/streams/followed",
			params: {
				user_id: result.id,
			},
			headers: {
				"Client-Id": result.clientid,
				Authorization: "Bearer " + result.accessToken,
			},
		});

		res.json({ ok: true, data: twitch.data.data });
	} catch (e) {
		res.statusCode = 500;
		res.json({ ok: false, error: e?.message });
	}
}
