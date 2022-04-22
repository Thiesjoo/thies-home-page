<template>
	<!-- This component executes the getCurrentLesson function, which also populates the state
of this component-->
	<Base
		color="cyan"
		:val="getCurrentLesson"
		:subval="tooltip.location"
		link="https://datanose.nl/#timetable[195750](0,0)"
	>
		<span :title="tooltip.location">{{in}}</span>
		<!-- TODO: add hover with location and better description -->
	</Base>
	<div v-if="in">
		<Base color="fuchsia" :val="text" link="https://ishetpauze.nl"
			><span :title="tooltip.pauze">Pauze</span></Base
		>
	</div>
</template>

<script lang="ts">
const baseTime = new Date();

import { defineComponent } from "@vue/runtime-core";
import Base from "@/widgets/Base.vue";
//@ts-ignore
import { default as ms } from "ms";

function pauseText() {
	const t = baseTime.getMinutes();

	if (t < 45) {
		return [
			`in ${45 - t} minute${45 - t > 1 ? "s" : ""}`,
			"Break at every last quarter of an hour",
		];
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

function getEventWithSlack(
	list: EventDatanose[],
	slack: number
): EventDatanose | undefined {
	const findTime = baseTime.getTime();

	return list.find(
		(x) =>
			x.type == "VEVENT" &&
			new Date(x.start).getTime() - slack < findTime &&
			new Date(x.end).getTime() > findTime
	);
}

function generateTooltip(event: EventDatanose) {
	const TA = event.description.match(/\((.*?)\)/)?.[1];

	return `${event.location} - ${TA}`;
}

export default defineComponent({
	data(): {
		text: string;
		interval: number | null;
		inLesson: boolean;
		in: string | null;
		tooltip: {
			pauze: string;
			location: string;
		};
	} {
		return {
			interval: null,
			text: pauseText()[0],
			inLesson: false,
			in: null,
			tooltip: {
				location: "",
				pauze: pauseText()[1],
			},
		};
	},
	methods: {
		async getCurrentLesson() {
			const fetchRes = await (
				await fetch("/api/external/rooster_parser")
			).json();
			const arr: EventDatanose[] = Object.values(fetchRes.data);

			const currentEvent = getEventWithSlack(arr, ms("30s"));
			if (currentEvent) {
				this.in = "Nu";
				this.tooltip.location = generateTooltip(currentEvent);

				return `${currentEvent.summary}`;
			}

			const upcomingEvent = getEventWithSlack(arr, ms("15m"));
			if (upcomingEvent) {
				this.in = ms(
					new Date(upcomingEvent.start).getTime() - baseTime.getTime()
				);
				this.tooltip.location = generateTooltip(upcomingEvent);

				return upcomingEvent.summary;
			}

			throw new Error("Not in lesson!");
		},
	},

	beforeDestroy() {
		if (this.interval) clearInterval(this.interval);
	},
	created() {
		const self = this;
		self.interval = setInterval(() => {
			const [announce, atTime] = pauseText();
			self.text = announce;
			self.tooltip.pauze = atTime;
		}, 1000);
	},
	components: { Base },
});
</script>
