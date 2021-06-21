<template>
	<div class="container">
		<h1>User list for {{ user }}</h1>
		<p>
			Intial data from: {{ initialTime | date }}. Last updated:
			{{ lastUpdatedTime | date }}
		</p>
		<ul>
			<li v-for="(item, index) in users" :key="index">{{ item }}</li>
		</ul>
	</div>
</template>

<script>
import { Client as TwitchChatClient } from "tmi.js";
const client = new TwitchChatClient({
	channels: [],
});

const BOTLIST = [
	"guanthebot",
	"madestoutbot",
	"cloudlog",
	"discord_for_streamers",
	"soundalerts",
	"streamelements",
];

export default {
	data() {
		return {
			users: [],
			user: "",
			initialTime: null,
			lastUpdatedTime: null,
		};
	},
	async mounted() {
		console.log("Connecting to twitch");
		await client.connect();

		const { user = "madestout" } = this.$route.query;
		this.user = user;
		client.join(user);

		const resp = await fetch(`api/twitch_users?user=${user}`);
		const data = await resp.json();
		if (!data.data) {
			return;
		}
		this.initialTime = new Date();
		this.lastUpdatedTime = new Date();
		this.users = data.data;
	},
	created() {
		console.log("Registering callback");
		client.on("message", (channel, tags, message, self) => {
			addNewUser(this.users, this.time, tags["display-name"]);
		});

		client.on("join", (channel, username) => {
			addNewUser(this.users, this.time, username);
		});
	},
	beforeDestroy() {
		console.log("Disconnecting from twitch");
		client.disconnect();
	},
};

function addNewUser(users, time, tags) {
	const name = tags.toLowerCase();
	if (
		!users.includes(name) &&
		!name.startsWith("justinfan") &&
		!BOTLIST.includes(name)
	) {
		users.push(name);
		users.sort();
		time = new Date();
	}
}
</script>

<style></style>
