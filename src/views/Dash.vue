<template>
	<span
		v-if="user.loading.form || user.loading.userdata"
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

	<div v-if="user.loggedIn && !user.loading.userdata && user.user">
		<div
			v-for="location in ALL_LOCATIONS"
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
			<!-- TODO: Shared state across browser tabs? Spotify would be fetching very often, and pos doesn't need updating every 5 seconds
		-->

			<draggable
				:id="location"
				class="draggable"
				:list="user.user.settings.widgets[location]"
				group="widgets"
				@sort="move"
				:item-key="generateKey"
			>
				<template #item="{ element }">
					<div>
						<component
							:is="element.type"
							:left="location.includes('left')"
							:right="location.includes('right')"
						></component>
					</div>
				</template>
			</draggable>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import * as Widgets from "@/components/widgets";
import errorCaptured from "@/components/widgets/errorCaptured";
import { ALL_LOCATIONS, useUserStore, Widget } from "@/store/user.store";
import draggable from "vuedraggable";

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

export default defineComponent({
	data() {
		return {
			interval: null as number | null,
			time: getCurrentTime(),
			seconds: new Date().getSeconds(),
			balance: "...",
			greeting: getGreeting(),
			ALL_LOCATIONS,
		};
	},
	beforeDestroy() {
		if (this.interval) clearInterval(this.interval);
	},
	errorCaptured,
	setup() {
		return { user: useUserStore() };
	},
	computed: {
		name(): string {
			return this.user.user?.name ? `, ${this.user.user.name}` : ``;
		},
	},
	methods: {
		generateKey(a: Widget) {
			return a.type + a.id;
		},
		move(evt: any) {
			const from = evt.from.id;
			const to = evt.to.id;

			console.log(from, to, evt.item);
			// TODO: Update store
		},
	},
	async created() {
		this.interval = setInterval(() => {
			this.time = getCurrentTime();
			this.greeting = getGreeting();
			this.seconds = new Date().getSeconds();
		}, 1000);
	},
	components: { ...Widgets, draggable },
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
	width: 10%;
}

.draggable {
	min-height: 400px;
	width: 100%;
}

.widget.bottom-0 > * {
	vertical-align: bottom;
}

.widget.right-0 > * {
	float: right;
}

.widget.left-0 > * {
	float: left;
}
</style>
