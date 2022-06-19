<template>
	<Base :loaded="Math.abs(1 - level) > 0.01">
		<template #content>
			<Battery :percentage="percentage" :charging="charging"></Battery>
		</template>
	</Base>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Battery from "@/components/Battery.vue";
import { Base } from ".";
import { useBattery } from "@vueuse/core";

export default defineComponent({
	setup() {
		const { charging, level } = useBattery();
		return { charging, level };
	},
	computed: {
		percentage(): number {
			return Math.round(this.level * 100);
		},
	},
	components: { Battery, Base },
});
</script>
