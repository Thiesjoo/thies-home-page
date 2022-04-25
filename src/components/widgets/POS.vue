<template>
	<Base color="blue" :val="getBalance" link="https://pos.svia.nl/pos">POS</Base>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { Base } from "./";

export default defineComponent({
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
