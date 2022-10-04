<template>
	<span
		v-if="user.loading.form || user.loading.userdata"
		class="w-3 h-3 m-2 animate-ping absolute inline-flex rounded-full bg-sky-400 opacity-75"
	></span>
	<div class="background" :style="{ backgroundImage: background }"></div>

	<div class="centered">
		<div class="info">
			<div class="flex items-center justify-center">
				<span class="seconds absolute text-neutral-200" v-if="user.user?.settings?.showSeconds"
					>{{ seconds }}
				</span>
				<!-- TODO: on 11:00 the seconds get off centered -->
				<h2 class="time">{{ time }}</h2>
			</div>
			<span class="date text-neutral-200" v-if="user.user?.settings?.showDate">{{ date }}</span>
			<h3 class="greeting">Good {{ greeting }}{{ name }}.</h3>
		</div>
	</div>

	<div v-if="user.loggedIn && !user.loading.userdata && user.user">
		<draggable
			v-for="location in ALL_LOCATIONS"
			:class="{
				'left-0': location.includes('left'),
				'right-0': location.includes('right'),
				'top-0': location.includes('top'),
				'bottom-0': location.includes('bottom'),
				// Small padding to move out of the way of version modal
				'pb-3': location.includes('bottom') && location.includes('left'),
				'border-2 border-sky-500 border-dashed rounded-md bg-sky-500/[.1]': dragging > 0,
			}"
			:id="location"
			class="widget"
			v-model="user.user.settings.widgets[location]"
			group="widgets"
			:item-key="generateKey"
			@start="start"
			@end="end"
		>
			<template #item="{ element }">
				<div>
					<component
						:is="element.name"
						:left="location.includes('left')"
						:right="location.includes('right')"
						:bottom="location.includes('bottom')"
					></component>
				</div>
			</template>
		</draggable>

		<div class="absolute top-[-16px] justify-center flex w-full" v-show="dragging == 1">
			<draggable
				class="p-[4rem] border-2 border-sky-500 border-dashed rounded-md bg-sky-500/[.1] flex flex-col items-center"
				:group="{ name: 'widgets', pull: false }"
				:item-key="generateKey"
			>
				<template #header>
					<font-awesome-icon :icon="['fas', 'trash']" class="w-16 h-16" />
				</template>
				<template #item="{}"></template>
			</draggable>
		</div>

		<new-widget-modal @dragging="childDrag"></new-widget-modal>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import * as Widgets from "@/components/widgets";
import errorCaptured from "@/components/widgets/errorCaptured";
import { ALL_LOCATIONS, useUserStore, Widget } from "@/store/user.store";
import draggable from "vuedraggable";
import NewWidgetModal from "@/components/NewWidgetModal.vue";
import { generateKey } from "@/helpers/generateKeyFromWidget";

function getCurrentDate() {
	return Intl.DateTimeFormat("nl-NL", {
		month: "long",
		day: "numeric",
	}).format();
}

function getCurrentTime() {
	return Intl.DateTimeFormat("nl-NL", {
		hour: "numeric",
		minute: "numeric",
	})
		.format()
		.replace(":", "∶");
}

function getSeconds() {
	return (new Date().getSeconds() + "").padStart(2, "0");
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
			date: getCurrentDate(),
			time: getCurrentTime(),
			seconds: getSeconds(),
			greeting: getGreeting(),
			balance: "...",
			ALL_LOCATIONS,
			dragging: 0,
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
		background(): string {
			const url = this.user.user?.settings.background;

			return (url ? `url("${url}"),` : "") + `url("https://source.unsplash.com/random/1920x1080/?landscape")`;
		},
	},
	methods: {
		generateKey,
		start() {
			this.dragging = 1;
		},
		end() {
			this.dragging = 0;
		},
		childDrag(dragging: boolean) {
			// console.log("HMmm");
			this.dragging = dragging ? 2 : 0;
		},
	},
	async created() {
		this.interval = setInterval(() => {
			this.date = getCurrentDate();
			this.time = getCurrentTime();
			this.greeting = getGreeting();
			this.seconds = getSeconds();
		}, 1000);
	},
	components: { ...Widgets, draggable, NewWidgetModal },
});
</script>
<style>
body {
	font-family: sans-serif;
	text-shadow: 0 1px 5px rgb(0 0 0 / 10%);
	color: #fff;
	overflow: hidden;
}

.background {
	background: linear-gradient(to right, #74ebd5 0%, #9face6 100%);
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

.date {
	font-size: 150%;
	font-weight: 100;

	position: absolute;
	top: 0px;
	left: 50%;
	transform: translate(-50%);
}

.time {
	font-size: 1050%;
	font-weight: 500;
	letter-spacing: -5px;
	font-variant-numeric: tabular-nums lining-nums;
}

.seconds {
	font-size: 100%;
	/* margin-left: 5px; */
	transform: translate(15%, 50%);
}

body.linux .seconds {
	transform: translate(15%);
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
	display: flex;
	flex-direction: column;
	margin: 1em;
	width: 10%;
	min-height: 400px;
	min-width: 400px;
}

.widget.bottom-0 {
	flex-direction: column-reverse;
}

.widget.right-0 {
	align-items: flex-end;
}

.widget.right-0 > * {
	float: right;
}

.widget.left-0 > * {
	float: left;
}

.appear {
	transition: all 0.3s ease-in-out;
}

.appear:hover {
	transform: scale(2.5) translateY(24px);
}
</style>
