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
			throw new Error("omegalul");
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
