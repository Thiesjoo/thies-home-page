<template>
	<Base
		color="cyan"
		:val="getCurrentLesson"
		link="https://datanose.nl/#timetable[195750](0,0)"
		>Nu
	</Base>
	<Base color="fuchsia" :val="text" link="https://ishetpauze.nl">Pauze</Base>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Base from "@/widgets/Base.vue";
//@ts-ignore
import { default as ms } from "ms";

function pauseText() {
	const t = new Date().getMinutes();

	if (t < 45) {
		return `Nog ${45 - t}m`;
	} else {
		return `JAAAA!!!🎉🎊`;
	}
}

export default defineComponent({
	methods: {
		async getCurrentLesson() {
			const fetchRes = await (await fetch("/api/external/via")).json();
			console.log(fetchRes);
			const arr: { type: string; start: string; end: string }[] = Object.values(
				fetchRes.data
			);

			const findTime = new Date().getTime();
			const slack = ms("15m") as number;
			const eventRightNow = arr.find(
				(x) =>
					x.type == "VEVENT" &&
					new Date(x.start).getTime() - slack < findTime &&
					new Date(x.end).getTime() - slack > findTime
			);

			return "oeps";
		},
	},
	data(): {
		text: string;
		interval: number | null;
	} {
		return {
			interval: null,
			text: pauseText(),
		};
	},
	beforeDestroy() {
		if (this.interval) clearInterval(this.interval);
	},
	created() {
		const self = this;

		self.interval = setInterval(() => {
			self.text = pauseText();
		}, 1000);
	},
	components: { Base },
});
</script>
