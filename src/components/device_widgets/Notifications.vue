<template>
	<div>Test123</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useDevicesStore } from "@/store/device.store";
import { Device } from "@/helpers/types/customdash.summary";

export default defineComponent({
	props: {
		device: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {};
	},
	setup(props) {
		return { devices: useDevicesStore(), current: props.device as Device };
	},

	mounted() {
		console.log("test", this.current);
		this.devices.requestNotifications(this.current.id);
	},
});
</script>
