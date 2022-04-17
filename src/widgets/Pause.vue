<template>
	<Base
		color="cyan"
		val="Besturingssystemen "
		link="https://datanose.nl/#timetable[195750](0,0)"
		>Nu
	</Base>
	<Base color="fuchsia" :val="text" link="https://ishetpauze.nl">Pauze</Base>
</template>

<script>
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
	methods: {},
	data() {
		return {
			interval: null,
			text: pauseText(),
		};
	},
	beforeDestroy() {
		clearInterval(this.interval);
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
