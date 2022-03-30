import { VercelRequest, VercelResponse } from "@vercel/node";
import "axios";
import axios from "axios";

export default async function (req: VercelRequest, res: VercelResponse) {
	const token = req.cookies.accesstoken;

	if (!token) {
		res.status(401);
		res.json({ error: "No accesstoken found" });
		return;
	}

	console.log(token);

	try {
		const result = (
			await axios({
				url: "http://localhost:6969/api/users/me/providers/twitch",
				headers: {
					authorization: `Bearer ${token}`,
					"X-Secret": "thisisatest",
				},
				method: "GET",
			})
		)?.data;

		console.log(result);

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

		console.log(twitch.data.data.length);

		// const fetchRes = await axios({
		// 	url: "http://localhost:6969/api/users/me/providers",
		// 	headers: {
		// 		authorization: `Bearer ${token}`,
		// 		"X-Secret": "thisisatest",
		// 	},
		// 	method: "GET",
		// });
		// console.log(
		// 	(
		// 		await Promise.all(
		// 			fetchRes.data.map((x) =>
		// 				axios({
		// 					url: "http://localhost:6969/api/users/me/providers/" + x,
		// 					headers: {
		// 						authorization: `Bearer ${token}`,
		// 						"X-Secret": "thisisatest",
		// 					},
		// 					method: "GET",
		// 				})
		// 			)
		// 		)
		// 	).map((x) => x.data)
		// );

		res.json({ ok: true });
		// res.json(fetchRes.data);
	} catch (e) {
		console.error(e);
		res.json({ ok: false });
	}
}
