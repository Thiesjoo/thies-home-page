import { VercelRequest, VercelResponse } from "@vercel/node";
import { Client, User } from "discord.js";
const client = new Client();

let user: User | null = null;

export default function (req: VercelRequest, res: VercelResponse) {
	client.on("ready", async () => {
		console.log(`Bot has logged in as ${client?.user?.tag}!`);
		user = await client.users.fetch("299983320815763456");
		if (!user) {
			return res.status(404).json({ ok: false, error: "User not found ):" });
		}

		return generateResponse(res);
	});

	if (user) {
		console.log("User was cached!");
		return generateResponse(res);
	}

	client.login(process.env.DISCORD_TOKEN);
}

function generateResponse(res: VercelResponse) {
	res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
	res.json({
		ok: true,
		tag: user?.discriminator,
		avatar: `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`,
		name: user?.username,
		id: user?.id,
	});
}
