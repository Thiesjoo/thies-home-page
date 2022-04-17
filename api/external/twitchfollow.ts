import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import getProviderCredentials from "./_getcredentials";

export default async function (req: VercelRequest, res: VercelResponse) {
	try {
		const result = await getProviderCredentials(req, res, "twitch");
		if (!result) return;

		const liveUsersRequest = await axios({
			url: "https://api.twitch.tv/helix/streams/followed",
			params: {
				user_id: result.id,
			},
			headers: {
				"Client-Id": result.clientid,
				Authorization: "Bearer " + result.accessToken,
			},
		});

		const users = liveUsersRequest.data.data;

		const profileImageRequest = await axios({
			url: "https://api.twitch.tv/helix/users",
			params: {
				id: users.map((x) => x.user_id),
			},
			headers: {
				"Client-Id": result.clientid,
				Authorization: "Bearer " + result.accessToken,
			},
		});
		const profileImages = profileImageRequest.data.data;

		// Joining the profile images with correct users
		const joined = users.map((x) => {
			return {
				...x,
				profile_image_url: profileImages.find((y) => y.id === x.user_id)
					?.profile_image_url,
			};
		});

		res.json({ ok: true, data: joined });
	} catch (e) {
		console.log(e);
		res.statusCode = 500;
		res.json({ ok: false, error: e?.message });
	}
}
