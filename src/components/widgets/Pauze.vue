<template>
	<div>
		<Base
			color="cyan"
			:loaded="loaded"
			link="https://datanose.nl/#timetable[195750](0,0)"
			:left="$attrs.left"
			:right="$attrs.right"
		>
			<template #short>
				<span :title="tooltip.location">{{ inTime }}</span>
			</template>

			<template #content>{{ text }}</template>
			<template #subcontent>{{ tooltip.location }}</template>
		</Base>
		<div v-if="inTime && !withSlack" :class="{ 'float-right': $attrs.right }">
			<Base color="fuchsia" :loaded="loaded" link="https://ishetpauze.nl" :left="$attrs.left" :right="$attrs.right">
				<template #short>
					<span :title="tooltip.pauze">Pauze</span>
				</template>

				<template #content>{{ pauzeText }}</template>
			</Base>
		</div>
	</div>
</template>

<script lang="ts">
const baseTime = new Date();

import { defineComponent } from "@vue/runtime-core";
import { Base } from "./";
import { default as ms } from "ms";
import { useLocalStorage } from "@vueuse/core";

function pauseText() {
	const t = new Date().getMinutes();

	if (t < 45) {
		return [`in ${45 - t} minute${45 - t > 1 ? "s" : ""}`, "Break at every last quarter of an hour"];
	} else {
		return [`JASSSSSSS!!!🎉🎊`, "HYPE 🎉🎊🎉🎊🎉🎊🎉🎊🎉🎊🎉🎊🎉🎊🎉🎊"];
	}
}

type EventDatanose = {
	type: string;
	start: string;
	end: string;
	location: string;
	summary: string;
	description: string;
};

function getEventWithSlack(list: EventDatanose[], slack: number): EventDatanose | undefined {
	const findTime = baseTime.getTime();

	return list.find(
		(x) => x.type == "VEVENT" && new Date(x.start).getTime() - slack < findTime && new Date(x.end).getTime() > findTime
	);
}

function generateTooltip(event: EventDatanose) {
	const TA = event.description.match(/\((.*?)\)/)?.[1];

	return `${event.location} - ${TA}`;
}

export default defineComponent({
	props: {
		sample: { type: Boolean },
	},
	data(): {
		pauzeText: string;
		interval: number | null;
		inLesson: boolean;
		inTime: string | null;
		withSlack: boolean;
		tooltip: {
			pauze: string;
			location: string;
		};
		text: string;
		loaded: boolean;
	} {
		return {
			interval: null,
			pauzeText: pauseText()[0],
			inLesson: false,
			inTime: null,
			withSlack: false,
			tooltip: {
				location: "",
				pauze: pauseText()[1],
			},
			text: "",
			loaded: false,
		};
	},
	methods: {
		getCurrentLesson(arr: EventDatanose[]) {
			const currentEvent = getEventWithSlack(arr, ms("30s"));
			if (currentEvent) {
				this.inTime = "Nu";
				this.tooltip.location = generateTooltip(currentEvent);
				this.withSlack = false;

				return `${currentEvent.summary}`;
			}

			const upcomingEvent = getEventWithSlack(arr, ms("15m"));
			if (upcomingEvent) {
				this.inTime = ms(new Date(upcomingEvent.start).getTime() - baseTime.getTime());
				this.tooltip.location = generateTooltip(upcomingEvent);
				this.withSlack = true;

				return upcomingEvent.summary;
			}
			return "";
		},
	},
	beforeDestroy() {
		if (this.interval) clearInterval(this.interval);
	},
	setup() {
		return { rawData: useLocalStorage("datanose-rooster", [] as EventDatanose[]) };
	},
	async mounted() {
		if (this.sample) {
			this.inTime = "Nu";
			this.tooltip.location = `SP G2.02 - Coole TA Bsc`;
			this.withSlack = false;

			this.text = `Laptopcollege`;
			this.loaded = true;
			return;
		}

		const self = this;
		self.interval = setInterval(() => {
			const [announce, atTime] = pauseText();
			self.pauzeText = announce;
			self.tooltip.pauze = atTime;
		}, 1000);

		if (this.rawData.length > 0) {
			this.text = this.getCurrentLesson(this.rawData);
			this.loaded = this.text !== "";
		}
		try {
			const fetchRes = await (await fetch("/api/external/rooster_parser")).json();
			const unsorted = Object.values(fetchRes.data) as EventDatanose[];
			unsorted.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

			this.rawData = unsorted.filter((x) => Date.now() < new Date(x.start).getTime()).slice(0, 20) as EventDatanose[];
			this.text = this.getCurrentLesson(this.rawData);

			this.loaded = this.text !== "";
		} catch (e) {
			console.error(e);
		}
	},
	components: { Base },
});
</script>
