<template>
	<div>
		<div v-if="loggedIn">
			<p>
				You are logged in! Your username:<i> {{ userData?.display_name }} </i>
			</p>
			<br />
			TMI status:
			<span :color="connected ? 'green' : 'red'"
				>{{ connected ? "on" : "off" }}line</span
			>
			<br />
			<div style="display: flex">
				<button v-on:click="sendMessage">Send a testing message</button>
				<button v-on:click="changeColor">Switch colors</button>
			</div>
		</div>
		<button v-on:click="login" v-if="!loggedIn">Login to Twitch</button>
	</div>
</template>

<script lang="ts">
import { getClient, initTMIClient, joinChannel } from "@/helpers/tmi";
import { defineComponent } from "@vue/runtime-core";

let finalToken = "";

function handleAuth() {
	console.log(window.location.hash);

	if (window.location.hash) {
		const params = new URLSearchParams(window.location.hash.slice(1));
		const token = params.get("access_token");

		if (!token) {
			console.error(window.location, params);
			return false;
		}

		console.log(token);
		finalToken = token;
		return true;
	}

	return false;
}
const clientId = "ghqt8m4iocsmp2f7q4dr7bd6pnbnh9";
const redirect = "http://localhost:3000/rainbow";
const scopes = ["chat:edit", "chat:read"];

// const originalColor = "#B018D1";
const colors = [
	"#FF0000",
	"#FF7F00",
	"#FFFF00",
	"#00FF00",
	"#0000FF",
	"#2E2B5F",
	"#8B00FF",
];

const status = handleAuth();

export default defineComponent({
	data: () => {
		return {
			loggedIn: status,
			connected: false,
			userData: {} as { [key: string]: any },
			channel: "guanthethird",
			originalColor: "#B018D1",
		};
	},
	computed: {
		username: function () {
			return this.userData?.display_name || "";
		},
	},
	async created() {
		try {
			if (status) {
				const [firstUser, ...rest] = (
					await fetch("https://api.twitch.tv/helix/users", {
						headers: {
							Authorization: "Bearer " + finalToken,
							"Client-Id": clientId,
						},
					}).then((x) => x.json())
				).data;

				if (!firstUser || !firstUser.display_name) {
					throw new Error("User not defined");
				}

				this.userData = firstUser;

				await initTMIClient(firstUser.login, finalToken);
				this.connected = true;
			}
		} catch (e) {
			console.error(e);
			this.loggedIn = false;
			this.connected = false;
		}
	},
	methods: {
		login: () => {
			const params = new URLSearchParams({
				client_id: clientId,
				redirect_uri: redirect,
				response_type: "token",
			});

			const finalURL =
				"https://id.twitch.tv/oauth2/authorize?" +
				params.toString() +
				"&scope=" +
				scopes.join("%20");

			console.log("Trying to login with URL: ", finalURL);
			window.location.replace(finalURL);
		},

		sendMessage: function () {
			getClient()?.say(this.channel, "madestRainbow");
		},

		changeColor: async function () {
			const client = getClient();
			if (!client) return;
			await client.join(this.channel);

			const listener =
				(resolve: any) => (channel: any, user: any, mesg: any, self: any) => {
					if (
						(channel === this.channel, user.username === this.userData.login)
					) {
						this.originalColor = user.color;
						resolve(user.color);
					}
				};

			try {
				let promise = new Promise((resolve, reject) => {
					client.on("message", listener(resolve));

					setTimeout(() => reject("too slow lol"), 1000);
				});

				client.say(this.channel, "madestRainbow");
				await promise;
			} catch (e) {
				console.error(e);
				return;
			} finally {
				client.removeListener("message", listener("a"));
			}

			console.log("Woah got original color: ", this.originalColor);

			for (let i = 0; i < colors.length; i++) {
				await client.color(colors[i]);
				await client.say(this.channel, "madestRainbow");
			}

			await client.color(this.originalColor);
			await client.say(this.channel, "madestRainbow");

			console.log("finished");
		},
	},
});
</script>

<style></style>
