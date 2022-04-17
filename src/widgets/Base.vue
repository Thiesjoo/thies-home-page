<template>
	<div class="p-2" v-if="loaded" @click="linkTo">
		<div
			class="inline-flex items-center bg-white leading-none text-purple-600 rounded-full p-2 shadow text-teal text-sm max-w-sm"
		>
			<span
				class="inline-flex text-white rounded-full h-6 px-3 justify-center items-center"
				:class="[color ? 'bg-' + color + '-600' : '']"
				style="max-width: 50%"
			>
				<slot></slot>
			</span>
			<span class="inline-flex px-2">{{ value }}</span>
		</div>
	</div>
</template>

<script>
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
	props: {
		color: String,
		val: {
			type: [Function, String],
			default() {
				return "...";
			},
		},
		link: String,
	},
	data() {
		return {
			value: "...",
			loaded: false,
		};
	},
	methods: {
		linkTo() {
			window.location.href = this.link;
		},
	},
	async created() {
		try {
			this.value = typeof this.val === "function" ? await this.val() : this.val;
			this.loaded = true;
		} catch (e) {
			console.warn(
				"Component with val: ",
				this.val,
				"failed to load with error: ",
				e
			);
		}
	},
});
</script>
