<template>
	<div class="container">
		<h1>Chatter lijst voor {{ broadcaster }}</h1>
		<p>
			Deze data is verzameled op: {{ initTime }}. De lijsten zijn gereset op: {{ resetTime }}. De laatste update
			was op: {{ updateTime }}
		</p>
		<div class="content">
			<div class="twitchList">
				<h2 style="font-weight: 800">Alle actieve chatters</h2>
				<p>
					<em>Van deze stream</em>
				</p>
				<ul>
					<li v-for="(item, index1) in allChatters" :key="index1" :class="item.type">
						{{ item.name }}
					</li>
				</ul>
			</div>
			<div class="liveList">
				<h2 style="font-weight: 800">Alle mensen die in de viewerlijst hebben gestaan</h2>
				<p>
					<em>Van deze stream. Elke 5 minuten ververst.</em>
				</p>
				<ul class="extraList">
					<li v-for="(item, index1) in allUsers" :key="index1" :class="item.type">
						{{ item.name }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { formatDate } from "@/helpers/formatDate";
import { disconnect, getClient, initTMIClient, joinChannel } from "@/helpers/tmi";
import { defineComponent } from "@vue/runtime-core";

const pause = initTMIClient();

type UserTypes = "user" | "mod" | "vip";
type User = {
	name: string;
	type: UserTypes;
};

/** The frontend list doesn't really have to be in sync with backend, because lurking bots will not chat */
const BOTLIST = ["guanthebot", "madestoutbot", "streamelements", "streamlabs"];

const comp = defineComponent({
	data(): {
		allChatters: User[];
		allUsers: User[];
		broadcaster: string;
		initialTime: Date | null;
		lastMessageTime: Date | null;
		lastListWipeTime: Date | null;
	} {
		return {
			allChatters: [],
			allUsers: [],
			broadcaster: "",
			initialTime: null,
			lastMessageTime: null,
			lastListWipeTime: null,
		};
	},
	computed: {
		initTime: function () {
			return this.initialTime !== null ? formatDate(this.initialTime) : "---";
		},
		updateTime: function () {
			return this.lastMessageTime !== null ? formatDate(this.lastMessageTime) : "---";
		},
		resetTime: function () {
			return this.lastListWipeTime !== null ? formatDate(this.lastListWipeTime) : "---";
		},
	},
	async mounted() {
		const { user } = this.$route.query;
		const parsedUser = (Array.isArray(user) ? user[0] : user) || "madestout";
		this.broadcaster = parsedUser;
		pause.then(() => joinChannel(parsedUser));

		if (this.broadcaster !== "madestout") {
			alert(
				"Sorry, maar deze pagina is alleen beschikbaar voor Madestout. Live chatters zijn wel beschikbaar, maar historische data niet."
			);
			return;
		}
		const respViewers = await fetch(`https://twitchtracker.thies.dev/api/viewers?user=${parsedUser}`);
		const viewers: {
			ok: boolean;
			data: User[];
		} = await respViewers.json();

		const respChatters = await fetch(`https://twitchtracker.thies.dev/api/chatters?user=${parsedUser}`);
		const chatters: {
			ok: boolean;
			data: User[];
			lastWipe: number;
		} = await respChatters.json();

		console.log(viewers, chatters);

		if (!viewers.data || !chatters.data) {
			alert("Stuk");
			console.log("Geen data gevonden");
			return;
		}
		this.initialTime = new Date();
		this.lastMessageTime = new Date();
		this.lastListWipeTime = new Date(chatters.lastWipe);

		this.allUsers = viewers.data.sort((a, b) => a.name.localeCompare(b.name));
		this.allChatters = chatters.data;
	},
	created() {
		const client = getClient();
		if (!client) return;

		client.on("message", (channel, tags, message, self) => {
			let name = tags["display-name"] || tags.username || "";
			let type: UserTypes = "user";
			if (tags.mod) {
				type = "mod";
			} else if (tags?.badges?.vip) {
				type = "vip";
			}

			if (
				!name.startsWith("justinfan") && // Anon twitch user.
				!BOTLIST.includes(name.toLowerCase())
			) {
				this.lastMessageTime = new Date();

				const index = this.allUsers.findIndex((user) => user.name.toLowerCase() === name.toLowerCase());
				if (index === -1) {
					this.allUsers.push({ name, type });

					this.allUsers.sort((a, b) => a.name.localeCompare(b.name));
				}

				const index2 = this.allChatters.findIndex((user) => user.name.toLowerCase() === name.toLowerCase());
				if (index2 === -1) {
					this.allChatters.push({ name, type });
				}
			}
		});
	},
	beforeDestroy() {
		disconnect();
	},
});

export default comp;
</script>

<style>
.content {
	display: flex;
	width: 100%;
	flex-flow: row wrap;
	justify-content: space-evenly;
	padding-bottom: 10%;
	padding-top: 1em;
}

.twitchList {
	order: 0;
	margin-bottom: 50px;
}

.liveList {
	order: 2;
}

.twitchList,
.liveList {
	width: 70%;
	max-width: 500px;
}

ul {
	margin-top: 1em;
	list-style: none; /* Remove default bullets */
}

ul li::before {
	content: "\2022"; /* Add content: \2022 is the CSS Code/unicode for a bullet */
	font-weight: bolder;
	display: inline-block;
	width: 1.5em;
	margin-left: -1, 5em;
}

.mod::before {
	color: #1cb96a;
}

.vip::before {
	color: #e005b9;
}
</style>
