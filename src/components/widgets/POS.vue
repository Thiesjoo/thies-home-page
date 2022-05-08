<template>
	<Base color="blue" link="https://pos.svia.nl/pos" :loaded="loaded">
		<template #short>POS</template>
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
		this.text = await this.getBalance();
		this.loaded = true;
	},
	methods: {
		async getBalance() {
			const fetchRes = await fetch("/api/external/via");
			const res = await fetchRes.json();
			if (!res.balance) {
				throw new Error("POS balance is non existent");
			}

			return (res.balance / 100).toLocaleString("nl-NL", {
				style: "currency",
				currency: "EUR",
			});
		},
	},
	components: { Base },
});
</script>
