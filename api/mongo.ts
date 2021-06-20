import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectToDatabase } from "../extra/db";

export default async function (req: VercelRequest, res: VercelResponse) {
	res.json({
		message: await (await connectToDatabase("twitchtestbot"))
			.collection("users")
			.find({})
			.toArray(),
	});
}
