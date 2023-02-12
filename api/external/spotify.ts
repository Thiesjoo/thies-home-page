import { VercelRequest, VercelResponse } from "@vercel/node";
import { getProviderCredentials } from "./getcredentials";

export default async function (req: VercelRequest, res: VercelResponse) {
	try {
		const result = await getProviderCredentials(req, res, "spotify");
		if (!result) return;

		res.json({
			ok: true,
			data: {
				clientid: result.clientid,
				accesstoken: result.accessToken,
			},
		});
	} catch (e: any) {
		console.log(e);
		res.statusCode = 500;
		res.json({ ok: false, error: e?.message });
	}
}
