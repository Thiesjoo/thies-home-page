<template>
	<div class="w-24">
		<div
			class="shadow w-1/2 rounded border-2 border-gray-400 flex my-1 flex-row relative bg-gray-300"
		>
			<div
				class="cursor-default text-xs font-bold leading-none flex items-center justify-center m-1 py-2 text-center text-white"
				:class="['bg-' + color + '-400']"
				:style="{ width: `${percentage}%` }"
			>
				<div
					class="absolute left-0 text-gray-700"
					:class="{ 'mx-1': charging, 'mx-2.5': !charging }"
				>
					<font-awesome-icon
						:icon="['fas', 'bolt']"
						color="black"
						v-if="charging"
					/>
					{{ percentage }}%
				</div>
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
			const found = colors.find((x) => (self.percentage || 0) > x[0]) || "grey";
			return found[1];
		},
	},
});
</script>
