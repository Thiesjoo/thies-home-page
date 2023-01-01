<template>
	<div class="min-w-[8rem]">
		<div class="shadow rounded border-2 border-gray-400 flex my-1 flex-row relative bg-gray-300">
			<div
				class="flex items-center justify-center m-1 py-4"
				:class="['bg-' + color + '-600']"
				:style="{ width: `${percentage}%` }"></div>
			<div
				class="absolute left-0 right-0 top-0 bottom-0 text-gray-700 text-xs font-bold leading-none py-2 m-1 text-center"
				:class="{ 'mx-1': charging, 'mx-2.5': !charging }">
				<font-awesome-icon :icon="['fas', 'bolt']" color="black" v-if="charging" />
				{{ percentage }}%
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

const colors: [number, string][] = [
	[50, "green"],
	[25, "yellow"],
	[0, "red"],
];

export default defineComponent({
	props: {
		percentage: {
			type: Number,
		},
		charging: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		color(): string {
			const self = this;
			const found = colors.find((x) => (self.percentage || 0) > x[0]) || "gray";
			return found[1];
		},
	},
});
</script>
