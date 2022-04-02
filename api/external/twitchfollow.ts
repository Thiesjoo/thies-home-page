import { VercelRequest, VercelResponse } from "@vercel/node";
import "axios";
import axios from "axios";

const baseURL = process.env.BASEURL;

export default async function (req: VercelRequest, res: VercelResponse) {
	let token = req.cookies.accesstoken;

	if (!token) {
		res.status(401);
		res.json({ error: "No accesstoken found" });
		return;
	}

	try {
		const result = (
			await axios({
				url: baseURL + "/api/users/me/providers/twitch",
				headers: {
					Authorization: `Bearer ${token}`,
					"X-Secret": process.env.secret,
				},
				method: "GET",
			})
		)?.data;

		console.log("Twitch provider api:", result);

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

		console.log(twitch.data);
		res.json({ ok: true, data: twitch.data.data.length });
	} catch (e) {
		console.error(e);
		res.json({ ok: false });
	}
}
