<template>
	<Base color="green" :loaded="loaded">
		<template #short>Dummy</template>
		<template #content>{{ text }}</template>
	</Base>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { Base } from "./";

export default defineComponent({
	data() {
		return { text: "", loaded: false };
	},
	async created() {
		await this.init();
		this.loaded = true;
	},
	methods: {
		async init() {
			let time = Math.round(Math.random() * 1000 + 400);
			this.text = `Loaded in ${time} ms`;
			await new Promise((r) => setTimeout(r, time));
		},
	},
	components: { Base },
});
</script>
