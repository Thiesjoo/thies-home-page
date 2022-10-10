<template>
	<Base :loaded="true">
		<template #content>
			<div v-for="device in devices">{{ device.id }}</div>
		</template>
	</Base>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import axios from "axios";
import { Base } from ".";

export default defineComponent({
	data() {
		return { devices: [] as { id: string }[] };
	},
	methods: {
		async getUpdatedDevices() {
			const res = (
				await axios.get("https://windows.thies.dev/output/devices/summary", {
					headers: {
						Authorization: "Bearer",
					},
				})
			).data;
			console.log(res);
			return [{ id: "test" }];
		},
	},
	async mounted() {
		console.log("Requesting here:");
		this.devices = await this.getUpdatedDevices();
	},
	components: { Base },
});
</script>
