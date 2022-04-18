<template>
	<span
		v-if="current > 0"
		class="w-3 h-3 m-2 animate-ping absolute inline-flex rounded-full bg-sky-400 opacity-75"
	></span>
	<div class="background"></div>

	<div class="centered">
		<div class="info">
			<h2 class="time">{{ time }}</h2>
			<h3 class="greeting">Good {{ greeting }}{{ name }}.</h3>
		</div>
	</div>

	<div v-if="authed" class="widget top-0 right-0">
		<POS />
		<TwitchFollow />
	</div>

	<div v-if="authed" class="widget bottom-0 right-0">
		<Pause />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import TwitchFollow from "@/widgets/TwitchFollow.vue";
import POS from "@/widgets/POS.vue";
import Pause from "@/widgets/Pause.vue";

function getCurrentTime() {
	return Intl.DateTimeFormat("nl-NL", {
		hour: "numeric",
		minute: "numeric",
	}).format();
}

function getGreeting() {
	const date = new Date();
	let hours = date.getHours();
	return hours < 12
		? "morning"
		: hours <= 18 && hours >= 12
		? "afternoon"
		: "night";
}

function listener() {
	//@ts-ignore
	this.current = window.networking.currentlyLoadingRequests;
}

export default defineComponent({
	data() {
		return {
			interval: null as number | null,
			time: getCurrentTime(),
			balance: "...",
			name: "",
			current: 0,
			greeting: getGreeting(),

			authed: false,
		};
	},
	beforeDestroy() {
		if (this.interval) clearInterval(this.interval);
		window.removeEventListener("currentlyLoadingRequests", listener.bind(this));
	},
	async created() {
		this.interval = setInterval(() => {
			this.time = getCurrentTime();
			this.greeting = getGreeting();
		}, 1000);

		const self = this;

		window.addEventListener("currentlyLoadingRequests", listener.bind(this));

		try {
			const res = await (await fetch("/api/whoami")).json();
			if (res.name) {
				this.name = `, ${res.name}`;
			}

			this.authed = true;
		} catch (_) {}
	},
	components: { TwitchFollow, POS, Pause },
});
</script>
<style>
body {
	font-family: -apple-system, BlinkMacSystemFont, "Neue Haas Grotesk Text Pro",
		"Helvetica Neue", Helvetica, Arial, sans-serif !important;
	text-shadow: 0 1px 5px rgb(0 0 0 / 10%);
	color: #fff;
	overflow: hidden;
}

.background {
	background: url("https://source.unsplash.com/random/1920x1080/?landscape"),
		linear-gradient(to right, #74ebd5 0%, #9face6 100%);
	position: absolute;

	-webkit-backface-visibility: hidden;
	-moz-backface-visibility: hidden;
	-ms-backface-visibility: hidden;
	backface-visibility: hidden;

	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: transparent;
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
	width: 100vw;
	height: 100vh;
	z-index: -1;
}

.centered {
	height: 100vh;
}

.info {
	flex-direction: column;
}

.centered,
.info {
	display: flex;
	align-items: center;
	justify-content: center;
}

.time {
	font-size: 1050%;
	font-weight: 500;
	letter-spacing: -5px;
}

.greeting {
	font-size: 3.375rem;
	font-weight: 300;
}

.time,
.greeting {
	cursor: default;
	text-align: center;
	line-height: 1;
	padding: 0;
	margin: 0;
}

.widget {
	position: absolute;
	margin: 1em;
	max-width: 10%;
}

.widget > * {
	float: right;
}
</style>
