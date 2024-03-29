<template>
	<div class="max-h-[10%]">
		<button class="rounded-md bg-teal-400 p-2" @click="requestData">Request live CPU data</button>
		<h2 class="text-2xl font-bold">CPU Usage</h2>
		<Line
			id="my-chart-id"
			:options="{
				responsive: true,

				plugins: {
					legend: {
						display: false,
					},
				},
				scales: {
					y: {
						min: 0,
						max: 100,
					},
				},
				elements: {
					line: {
						tension: 0.1,
					},
				},
			}"
			:data="chartData"></Line>
	</div>
</template>

<script lang="ts">
import { Device } from "@/generated";
import { useDevicesStore } from "@/store/device.store";
import { defineComponent } from "vue";

import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
	PointElement,
	LineElement,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

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
	computed: {
		chartData() {
			if (!this.devices.livedata?.[this.current.uid]?.cpu) {
				return {
					datasets: [],
				};
			}

			const amtOfCores = this.devices.livedata[this.current.uid].cpu![0].load.length;

			return {
				labels: this.devices.livedata[this.current.uid].cpu!.map((loadArr) => {
					return `${Math.round((Date.now() - loadArr.dateReceived) / 1000)}s ago`;
				}),
				datasets: [
					...Array.from({ length: amtOfCores }, (_, i) => i).map((core) => ({
						label: `Core ${core}`,
						data:
							this.devices.livedata[this.current.uid].cpu!.map((loadArr) => loadArr.load[core].load) ??
							[],
						backgroundColor: `hsl(${(core / amtOfCores) * 360}, 100%, 50%)`,
						borderColor: `hsl(${(core / amtOfCores) * 360}, 100%, 50%)`,
						fill: false,
						pointRadius: 0,
						pointHoverRadius: 0,
						borderWidth: 1,
					})),
				],
			};
		},
	},
	methods: {
		requestData() {
			this.devices.requestCPUData(this.current.uid);
		},
	},
	setup(props) {
		return { devices: useDevicesStore(), current: props.device as Device };
	},
	components: { Line },
});
</script>
