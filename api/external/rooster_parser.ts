import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import * as ICAL from "node-ical";
import { default as ms } from "ms";
import { readFileSync } from "fs";
import { join } from "path";

export default async function (req: VercelRequest, res: VercelResponse) {
	let rooster_data: string;
	if (
		process.env.VERCEL &&
		(process.env.VERCEL_ENV === "production" ||
			process.env.VERCEL_ENV === "preview")
	) {
		console.log("Fetching rooster");
		rooster_data = (await axios({ url: "https://datanose.nl/195750.ics" }))
			?.data;
	} else {
		console.log("Caching rooster");
		rooster_data = readFileSync(join(__dirname, "rooster.ics"), "utf8");
	}

	const parsed = await ICAL.async.parseICS(rooster_data);
	res.setHeader(
		"Cache-Control",
		"max-age=0, s-maxage=" + ((ms("7d") as number) / 1000).toString()
	);

	res.json({
		data: parsed,
	});
}
