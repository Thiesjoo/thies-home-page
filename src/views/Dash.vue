<template>
	<span
		v-if="currentNetworkRequests > 1"
		class="w-3 h-3 m-2 animate-ping absolute inline-flex rounded-full bg-sky-400 opacity-75"
	></span>
	<div class="background"></div>

	<div class="centered">
		<div class="info">
			<div>
				<span
					class="seconds w-full absolute left-0 bottom-1/2 text-center text-neutral-200"
					v-if="user.user?.settings?.showSeconds"
					>{{ seconds }}
				</span>
				<!-- TODO: on 11:00 the seconds get off centered -->
				<h2 class="time">{{ time }}</h2>
			</div>
			<h3 class="greeting">Good {{ greeting }}{{ name }}.</h3>
		</div>
	</div>

	<div v-if="user.loggedIn && !user.loading.userdata">
		<div
			v-for="location in locations"
			class="widget"
			:class="{
				'left-0': location.includes('left'),
				'right-0': location.includes('right'),
				'top-0': location.includes('top'),
				'bottom-0': location.includes('bottom'),
				// Small padding to move out of the way of version modal
				'pb-3': location.includes('bottom') && location.includes('left'),
			}"
		>
			<!-- TODO: Shared state for every component? Pinia state or something, because spotify would be fetching often
	Could also limit 1 instance per type
		-->
			<component v-for="widget in filtered(location)" :is="widget.type"></component>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import * as Widgets from "@/components/widgets";
import { windowEvent } from "@/helpers/constants";
import errorCaptured from "@/components/widgets/errorCaptured";
import { useUserStore, Widget } from "@/store/user.store";

function getCurrentTime() {
	return Intl.DateTimeFormat("nl-NL", {
		hour: "numeric",
		minute: "numeric",
	}).format();
}

function getGreeting() {
	const date = new Date();
	let hours = date.getHours();
	return hours < 12 ? "morning" : hours <= 18 && hours >= 12 ? "afternoon" : "night";
}

function listener() {
	//@ts-ignore
	this.currentNetworkRequests = window.networking.currentlyLoadingRequests;
}

export default defineComponent({
	data() {
		return {
			interval: null as number | null,
			time: getCurrentTime(),
			seconds: new Date().getSeconds(),
			balance: "...",
			currentNetworkRequests: 0,
			greeting: getGreeting(),
			locations: ["topleft", "topright", "bottomright", "bottomleft"],
		};
	},
	beforeDestroy() {
		if (this.interval) clearInterval(this.interval);
		window.removeEventListener(windowEvent, listener.bind(this));
	},
	errorCaptured,
	setup() {
		return { user: useUserStore() };
	},
	computed: {
		name(): string {
			return this.user.user?.name ? `, ${this.user.user.name}` : ``;
		},
		widgets(): Widget[] {
			return this.user.user?.settings.widgets || [];
		},
	},
	methods: {
		filtered(arg: string): Widget[] {
			return this.widgets.filter((x) => x.location === arg);
		},
	},
	async created() {
		this.interval = setInterval(() => {
			this.time = getCurrentTime();
			this.greeting = getGreeting();
			this.seconds = new Date().getSeconds();
		}, 1000);

		window.addEventListener(windowEvent, listener.bind(this));
	},
	components: { ...Widgets },
});
</script>
<style>
body {
	font-family: -apple-system, BlinkMacSystemFont, "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial,
		sans-serif !important;
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

.widget.right-0 > * {
	float: right;
}

.widget.left-0 > * {
	float: left;
}
</style>
