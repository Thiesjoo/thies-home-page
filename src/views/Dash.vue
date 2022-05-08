<template>
	<span
		v-if="current > 0"
		class="w-3 h-3 m-2 animate-ping absolute inline-flex rounded-full bg-sky-400 opacity-75"
	></span>
	<div class="background"></div>

	<div class="centered">
		<div class="info">
			<div>
				<span
					class="seconds w-full absolute left-0 bottom-1/2 text-center text-neutral-200"
					>{{ seconds }}
				</span>
				<!-- TODO: on 11:00 the seconds get off centered -->
				<h2 class="time">{{ time }}</h2>
			</div>
			<h3 class="greeting">Good {{ greeting }}{{ name }}.</h3>
		</div>
	</div>

	<div v-if="authed" class="widget top-0 right-0">
		<!-- <Spotify /> -->
		<POS />
		<TwitchFollow />
	</div>

	<div v-if="authed" class="widget bottom-0 right-0">
		<Pauze />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import * as Widgets from "@/components/widgets";
import { windowEvent } from "@/helpers/constants";
import errorCaptured from "@/components/widgets/errorCaptured";

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
			seconds: new Date().getSeconds(),
			balance: "...",
			name: "",
			current: 0,
			greeting: getGreeting(),

			//TODO: implement this in generic store
			authed: true,
		};
	},
	beforeDestroy() {
		if (this.interval) clearInterval(this.interval);
		window.removeEventListener(windowEvent, listener.bind(this));
	},
	errorCaptured,
	async created() {
		this.interval = setInterval(() => {
			this.time = getCurrentTime();
			this.greeting = getGreeting();
			this.seconds = new Date().getSeconds();
		}, 1000);

		window.addEventListener(windowEvent, listener.bind(this));

		try {
			const res = await (await fetch("/api/whoami")).json();
			if (res.name) {
				this.name = `, ${res.name}`;
			}

			// this.authed = true;
		} catch (_) {}
	},
	components: { ...Widgets },
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
	font-variant-numeric: tabular-nums lining-nums;
}

.seconds {
	font-size: 120%;
	margin-left: 4px;
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
