<template>
	<Base color="blue" link="https://pos.svia.nl/pos" :loaded="loaded">
		<template #short>POS</template>
		<template #content>{{ text }}</template>
	</Base>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { useLocalStorage } from "@vueuse/core";
import axios from "axios";
import { Base } from ".";

export default defineComponent({
	props: {
		sample: { type: Boolean },
	},
	data() {
		return { text: useLocalStorage("POS-credits", ""), loaded: false };
	},
	async created() {
		if (this.sample) {
			this.text = "€ 99,99";
			this.loaded = true;
			return;
		}

		if (this.text) {
			this.loaded = true;
		}
		try {
			this.text = await this.getBalance();
			this.loaded = true;
		} catch (e) {
			this.loaded = false;
			this.text = "";
		}
	},
	methods: {
		async getBalance() {
			const res = (await axios.get("/api/external/via", { baseURL: "/" })).data;

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
