<template>
	<div class="container">
		<h1>User list for {{ user }}</h1>
		<p>
			Intial data from: {{ initialTime | date }}. Last updated:
			{{ lastUpdatedTime | date }}
		</p>
		<p>
			Deze lijst heeft: Alle chatters van de afgelopen 20 minuten en de
			viewerlijst van twitch zelf!
			<em
				>(This list has all chatters from the previous 20 minutes and the twitch
				viewerlist)</em
			>
		</p>
		<ul>
			<li
				style=" list-style-type: none;"
				v-for="(type, index) in types"
				:key="index"
			>
				<hr style="height:20px" />
				<h3 style="font-weight: 800;">{{ userFriendlyTypes[type] }}</h3>
				<ul>
					<li v-for="(item, index1) in users[type]" :key="index1">
						{{ item }}
					</li>
				</ul>
			</li>
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
	"streamlabs",
	"carbot14xyz",
];

export default {
	data() {
		return {
			users: {
				mod: [],
				vip: [],
				user: [],
			},
			user: "",
			initialTime: null,
			lastUpdatedTime: null,

			types: ["mod", "vip", "user"],
			userFriendlyTypes: {
				mod: "Mods 🍤",
				vip: "Vips 🦐",
				user: "Users 🥺",
			},
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

		this.types.forEach((x) => {
			this.users[x] = filterArrayBasedOnType(data.data, x);
		});
	},
	created() {
		console.log("Registering callback");
		client.on("message", (channel, tags, message, self) => {
			let name = tags["display-name"].toLowerCase();
			let type = "user";
			if (tags.mod === "1") {
				type = "mod";
			} else if (
				typeof tags.badges === "string" &&
				tags.badges.startsWith("vip")
			) {
				type = "vip";
			}

			if (
				!this.users[type].includes(name) && // No dupes
				!name.startsWith("justinfan") && // Anon twitch user.
				!BOTLIST.includes(name)
			) {
				this.users[type].push(name);
				this.users[type].sort();
				time = new Date();
			}
		});
	},
	beforeDestroy() {
		console.log("Disconnecting from twitch");
		client.disconnect();
	},
};

function filterArrayBasedOnType(arr, type) {
	return arr.filter((x) => x.type === type).map((x) => x.name);
}
</script>

<style></style>
