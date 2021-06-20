import { VercelRequest, VercelResponse } from "@vercel/node";

export default function (req: VercelRequest, res: VercelResponse) {
	if (!process.env.VERCEL_GIT_COMMIT_SHA) {
		return res
			.status(404)
			.json({ ok: false, error: "Not currently deployed on vercel" });
	}
	res.json({
		ok: true,
		sha: process.env.VERCEL_GIT_COMMIT_SHA,
		message: process.env.VERCEL_GIT_COMMIT_MESSAGE,
		author: {
			name: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME,
			login: process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN,
		},
	});
}
