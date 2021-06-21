// Request recent messages from:
//
/**
 * Request recent messages from:
 * https://recent-messages.robotty.de/api (From last 10 minutes, parse IRC message)
 * https://tmi.twitch.tv/group/user/madestout/chatters (Get current viewers)
 *
 * Client should subscribe to messages in IRC and add those users to the list. Everything from here will be cached for 60 seconds?
 *
 * Filter out bots
 */

const BOTLIST = [
	"guanthebot",
	"madestoutbot",
	"cloudlog",
	"discord_for_streamers",
	"soundalerts",
	"streamelements",
];

import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import ms from "ms";
import { parse } from "irc-message";

export default async function(req: VercelRequest, res: VercelResponse) {
	const { user = "madestout" } = req.query;

	const recentReq = async () => {
		const data = (
			await axios(
				`https://recent-messages.robotty.de/api/v2/recent-messages/${user}?limit=100&hide_moderation_messages=true&hide_moderated_messages=true`
			)
		).data;
		return getUsersFromIRC(data);
	};

	const userReq = async () => {
		return combineViewers(
			(await axios(`https://tmi.twitch.tv/group/user/${user}/chatters`)).data
		);
	};

	try {
		const [recentMessages, viewerList] = await Promise.all([
			recentReq(),
			userReq(),
		]);

		res.setHeader("Cache-Control", "max-age=30, stale-while-revalidate=60");
		return res.json({
			message: `Returns (SORTED) users in chat from the past 20 minutes + users in viewerlist - bots`,
			data: filterBotsAndDuplicates([...recentMessages, ...viewerList]),
		});
	} catch (e) {
		console.error(e);
		return res.status(500).send({ ok: false, e });
	}
}

function combineViewers(data: {
	chatters: { [key: string]: string[] };
}): string[] {
	return Object.values(data.chatters).reduce((acc, val) => acc.concat(val), []);
}

/**
 * Get all the usernames of the people that chatted within the last maxDate miliseconds
 * @param irc The IRC comment
 * @param maxDate From what date to filter
 * @returns
 */
function getUsersFromIRC(
	irc: { messages: string[] },
	maxDate = ms("20m")
): string[] {
	const current = Date.now() - maxDate;
	return irc.messages
		.reduce((acc, val) => {
			const parsed = parse(val);
			if (!parsed.tags["rm-received-ts"]) {
				return acc;
			}
			let time = +parsed.tags["rm-received-ts"];
			if (current < time) {
				acc.push(parsed.tags["display-name"].toLowerCase());
			}
			return acc;
		}, [])
		.filter((x) => x);
}

function filterBotsAndDuplicates(users: string[]): string[] {
	const already = new Set();
	return users
		.filter((x) => {
			if (already.has(x) || BOTLIST.includes(x) || x.endsWith("bot")) {
				return false;
			}
			already.add(x);
			return true;
		})
		.sort();
}
