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
			console.log(tags);
			const name = tags["display-name"].toLowerCase();
			if (!this.users.includes(name)) {
				this.users.push(name);
				this.users.sort();
				this.lastUpdatedTime = new Date();
			}
		});
	},
	beforeDestroy() {
		console.log("Disconnecting from twitch");
		client.disconnect();
	},
};
</script>

<style></style>
