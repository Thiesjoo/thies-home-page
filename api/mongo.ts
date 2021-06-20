import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "../extra/db";

export default async function (req: VercelRequest, res: VercelResponse) {
	res.json({
		ok: true,
		data: await (await connectToDatabase("twitchtestbot"))
			.collection("users")
			.find({})
			.sort({ counter: -1 })
			.toArray(),
	});
}
