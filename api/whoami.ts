import { VercelRequest, VercelResponse } from "@vercel/node";

export default function (req: VercelRequest, res: VercelResponse) {
	if (!req.cookies.accesstoken) {
		return res.status(401).json({ ok: false, error: "Not authed" });
	}

	const [_, data, __] = req.cookies.accesstoken.split(".");
	if (!data) {
		return res.status(400).json({ ok: false });
	}
	const json = Buffer.from(data, "base64").toString("ascii");
	const parsed = JSON.parse(json);

	res.json({ name: parsed?.nam });
}
