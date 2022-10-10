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
						Authorization:
							"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MjQ1ZjhkMzdiM2M2MDRjZjAwMGU2OGQiLCJyb2wiOiJkZXZlbG9wZXIiLCJuYW0iOiJUaGllcyIsImlhdCI6MTY2NTQzMDM2MiwiZXhwIjoxNjY1NDMxMjYyLCJpc3MiOiJBdXRob3JpdW0tMCJ9.hJPnm7PqOGPQpNLRDaOxCQuL7oSGTF_opINkW0hX7-PPkcipl5NCBlSeGxNIuD3xFUxr-dAnRCnNfd9B21miyQB3XPXDAHmZwg16TEwPvabp0RxBnk2HLsUsgIRr1TOr-RIC6NC2JZtKOAGtQGlZygr16MjsEfsRfgeOyPuTAM0pTtpJ3XkCwx3UCY7Fr1QGehVCWys4Rau4ERTc9K68pZKJa9hdoi_z-bind5BftY7fXa7tsQREZfGN6C2JbVfQvL_0ehpBmSISC0lWkGa8VSwc0ksYBLQm7nAD7g7NImaaT8HWkonzZRtm-fQ-QLfgcmJFdRdGngFInAzBqC8ggw",
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
