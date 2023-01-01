<template>
	<Base :loaded="devices.length > 0">
		<template #content>
			<div
				v-for="device in devices"
				class="flex flex-col justify-center mx-5 text-center"
				v-on:click="openNewTabForDevice(device)">
				<div class="inline-flex items-center justify-center overflow-hidden rounded-full">
					<svg class="w-24 h-24">
						<circle
							class="text-gray-300"
							stroke-width="5"
							stroke="currentColor"
							fill="transparent"
							:r="radius"
							cx="48"
							cy="48" />
						<circle
							:class="getColorForBattery(device)"
							stroke-width="4"
							:stroke-dasharray="circumference"
							:stroke-dashoffset="circumference - (device.battery / 100) * circumference"
							stroke-linecap="round"
							stroke="currentColor"
							fill="transparent"
							:r="radius"
							cx="48"
							cy="48" />
					</svg>

					<!-- All device info -->
					<div class="absolute text-md flex flex-col space-y-1">
						<span class="text-blue-700 text-center">Bat: {{ device.battery }}% </span>

						<!-- Icons -->
						<div class="flex flex-row justify-center space-x-1">
							<font-awesome-icon
								:icon="['fas', 'hourglass']"
								class="text-red-600"
								v-if="isInformationTooOld(device, now)"
								title="We haven't received any information from this device for a while.">
							</font-awesome-icon>

							<font-awesome-icon :icon="getIconForDeviceType(device)" :title="getTitleType(device)">
							</font-awesome-icon>
							<font-awesome-icon
								:icon="getIconForNetworkStatus(device)"
								:title="getNetworkTypeTitle(device)">
							</font-awesome-icon>
							<font-awesome-icon
								:icon="['fas', 'bolt']"
								v-if="device.batteryCharging"
								title="Battery is charging">
							</font-awesome-icon>
						</div>
						<span
							class="text-[12px] text-orange-700 text-center"
							v-if="isInformationTooOld(device, now, true)"
							>Age: {{ informationAgeShort(device, now) }}
						</span>
					</div>
				</div>

				<span :title="device.name">{{ device.name.slice(0, 15) }}</span>
			</div>
		</template>
	</Base>
</template>

<script lang="ts">
import {
	allHelperFunctions,
	getColorForBattery,
	getIconForDeviceType,
	getIconForNetworkStatus,
	getNetworkTypeTitle,
	getTitleType,
	isInformationTooOld,
} from "@/helpers/remoteDevices";
import { Device } from "@/helpers/types/customdash.summary";
import { useDevicesStore } from "@/store/device.store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineComponent } from "@vue/runtime-core";
import { Base } from ".";

export default defineComponent({
	data() {
		// TODO: Update this timer automatically
		return { radius: 42, now: Date.now() };
	},
	computed: {
		circumference() {
			return this.radius * 2 * Math.PI;
		},
		devices(): Device[] {
			return this.devicesStore.devices?.summary ?? [];
		},
	},
	methods: {
		openNewTabForDevice(device: Device) {
			window.open(`https://customdash.thies.dev/output/devices/${device.id}`, "_blank");
		},
		...allHelperFunctions,
	},
	async mounted() {
		console.log("Requesting here:");
	},
	setup() {
		return { devicesStore: useDevicesStore() };
	},
	components: { Base },
});
</script>
