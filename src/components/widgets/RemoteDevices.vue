<template>
	<Base :loaded="true">
		<template #content>
			<div v-for="device in devices">{{ device.name }} - {{ device.battery }}</div>
		</template>
	</Base>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import axios from "axios";
import { Base } from ".";

export default defineComponent({
	data() {
		return { devices: [] as { [key: string]: any }[] };
	},
	methods: {
		async getUpdatedDevices() {
			const res = (
				await axios.get("https://customdash.thies.dev/output/summary", {
					headers: {
						Authorization: "Bearer",
					},
				})
			).data;
			console.log(res);
			return res.summary;
		},
	},
	async mounted() {
		console.log("Requesting here:");
		this.devices = await this.getUpdatedDevices();
	},
	components: { Base },
});
</script>
