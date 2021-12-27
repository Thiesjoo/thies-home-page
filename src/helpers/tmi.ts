// Too Much Information (:
import { Client as TwitchChatClient, Options } from "tmi.js";

declare global {
	interface Window {
		tmi: { client: TwitchChatClient; listeners: (() => {})[] } | undefined;
	}
}

export function initTMIClient(username?: string, auth?: string) {
	if (window.tmi) disconnect();

	console.log("Connecting to twitch");
	const options: Options = {
		channels: [],
		options: {
			debug: true,
			skipMembership: true,
			skipUpdatingEmotesets: true,
		},
	};

	if (auth) {
		if (!auth.startsWith("oauth:")) {
			auth = "oauth:" + auth;
		}

		options.identity = { username, password: auth };
	}

	const client = new TwitchChatClient(options);
	window.tmi = { client: client, listeners: [] };

	return client.connect();
}

export function joinChannel(channel: string): boolean {
	if (window.tmi) {
		window.tmi.client.join(channel);
		return true;
	}

	return false;
}

export function getClient(): TwitchChatClient | undefined {
	if (!window.tmi) return undefined;

	return window.tmi.client;
}

export function disconnect() {
	if (window.tmi) {
		window.tmi.client &&
			window.tmi.client.disconnect &&
			window.tmi.client.disconnect();
		window.tmi = undefined;
	}
}
