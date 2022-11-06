<template>
	<!-- For every device in the list, get 1/4 of page width and make a nice looking colunm -->
	<div class="total-container w-[100vw] h-[100vh] flex flex-row justify-center">
		<div v-for="device in devices" class="single-container w-[25vw] p-2 m-3">
			<!-- Header -->
			<div class="header-container">
				<div class="flex flex-row justify-between">
					<div class="flex flex-col space-y-1">
						<span class="text-lg font-bold">
							<font-awesome-icon :icon="getIconForDeviceType(device)" :title="getTitleType(device)" class="mr-1">
							</font-awesome-icon
							>{{ device.name }}</span
						>
						<span class="text-sm italic">{{ device.id }}</span>
					</div>
					<div class="flex flex-col space-y-1">
						<span class="text-lg font-bold"
							>{{ informationAgeShort(device) }}-
							<div
								class="w-[12px] h-[12px]"
								:style="{
									'background-color': getColorForAge(device),
									'border-radius': '50%',
									display: 'inline-block',
								}"></div
						></span>
						<span class="text-sm font-bold">
							<font-awesome-icon :icon="getIconForNetworkStatus(device)" :title="getNetworkTypeTitle(device)">
							</font-awesome-icon>
							{{ getNetworkTitle(device) }}
						</span>
						<span class="text-sm font-bold whitespace-nowrap">
							<font-awesome-icon :icon="['fas', 'battery']" class="mr-1"> </font-awesome-icon>
							<div class="w-[80%] rounded-full h-2.5 bg-gray-700 inline-block">
								<div
									class="0 h-2.5 rounded-full"
									:class="getColorForBattery(device, true)"
									:style="{
										width: device.battery + '%',
									}"></div>
							</div>
						</span>
					</div>
				</div>
			</div>

			<!-- Body -->
			<!-- TODO: Blur body when information gets too old -->
			<div class="flex flex-col space-y-2">
				<div>fakka</div>
				<div>fakka</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import errorCaptured from "@/components/widgets/errorCaptured";
import { allHelperFunctions } from "@/helpers/remoteDevices";
import { Device } from "@/helpers/types/customdash.summary";
import { useDeviceStore } from "@/store/device.store";
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "@vue/runtime-core";

const sampleSummary = {
	type: "laptop",
	name: "thies-zenbook",
	id: "test",
	uptime: 2390.19,
	upsince: 1665662516,
	battery: 37,
	batteryCharging: false,
	network: {
		interval: 5116,
		up: 2450.76892350709,
		down: 1773.7167964849211,
		ip4: "-",
		ip6: "-",
		type: "wifi",
		extraInfo: "eduroam [e185fa14] (null)",
		dateReceived: 1665666851741,
	},
	connected: false,
	lastConnected: {
		time: 1665666570337,
		ip: "-",
		location: {
			age: 1665666570337,
			lat: "-",
			lon: "-",
		},
	},
	dateReceived: 1665666857141,
};

export default defineComponent({
	data() {
		return {
			devices: [sampleSummary, sampleSummary] as Device[],
		};
	},
	beforeDestroy() {},
	errorCaptured,
	setup() {
		return { user: useUserStore(), device: useDeviceStore() };
	},
	computed: {},
	methods: {
		...allHelperFunctions,
	},
	async created() {},
	components: {},
});
</script>
<style>
.total-container {
	background: linear-gradient(120deg, #1e3c72 0%, #331c6a 100%);
}

.single-container {
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 10px;
}

.header-container {
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 10px;

	padding: 1em;
	margin-bottom: 2em;
}
</style>
