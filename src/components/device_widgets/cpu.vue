<template>
	<div class="max-h-[10%]">
		<button class="rounded-md bg-teal-400 p-2" @click="requestData">Request live CPU data</button>

		<table v-for="loadArr in devices.livedata?.[current.uid]?.cpu?.reverse()">
			<tr v-for="load in loadArr.load">
				<td>{{ load.core }}</td>
				<td>{{ load.load }}</td>
				<td>{{ load.temp }}</td>
			</tr>
		</table>
	</div>
</template>

<script lang="ts">
import { Device } from "@/generated";
import { formatDate } from "@/helpers/formatDate";
import { useDevicesStore } from "@/store/device.store";
import ms from "ms";
import { defineComponent } from "vue";

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
	methods: {
		requestData() {
			this.devices.requestCPUData(this.current.uid);
		},
	},
	setup(props) {
		return { devices: useDevicesStore(), current: props.device as Device };
	},
});
</script>
