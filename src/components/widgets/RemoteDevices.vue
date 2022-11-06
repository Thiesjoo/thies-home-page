<template>
	<Base :loaded="true">
		<template #content>
			<div
				v-for="device in devices"
				class="flex flex-col justify-center mx-5 text-center"
				v-on:click="openNewTabForDevice(device)"
			>
				<div class="inline-flex items-center justify-center overflow-hidden rounded-full">
					<svg class="w-24 h-24">
						<circle
							class="text-gray-300"
							stroke-width="5"
							stroke="currentColor"
							fill="transparent"
							:r="radius"
							cx="48"
							cy="48"
						/>
						<circle
							:class="{
								'text-green-500': device.battery > 50,
								'text-yellow-500': device.battery > 25 && device.battery <= 50,
								'text-red-500': device.battery <= 25,
								'text-gray-300': !hasBattery(device),
							}"
							stroke-width="4"
							:stroke-dasharray="circumference"
							:stroke-dashoffset="circumference - (device.battery / 100) * circumference"
							stroke-linecap="round"
							stroke="currentColor"
							fill="transparent"
							:r="radius"
							cx="48"
							cy="48"
						/>
					</svg>

					<!-- All device info -->
					<div class="absolute text-md flex flex-col space-y-1">
						<span class="text-blue-700 text-center">Bat: {{ device.battery }}% </span>

						<!-- Icons -->
						<div class="flex flex-row justify-center space-x-1">
							<font-awesome-icon
								:icon="['fas', 'hourglass']"
								class="text-red-600"
								v-if="isInformationTooOld(device)"
								title="We haven't received any information from this device for a while."
							>
							</font-awesome-icon>

							<font-awesome-icon :icon="getIconForDeviceType(device)" :title="getTitleType(device)">
							</font-awesome-icon>
							<font-awesome-icon :icon="getIconForNetworkStatus(device)" :title="getTitleNetwork(device)">
							</font-awesome-icon>
							<font-awesome-icon :icon="['fas', 'bolt']" v-if="device.batteryCharging" title="Battery is charging">
							</font-awesome-icon>
						</div>
						<span class="text-[12px] text-orange-700 text-center" v-if="isInformationTooOld(device, true)"
							>Age: {{ informationAgeShort(device) }}
						</span>
					</div>
				</div>

				<span :title="device.name">{{ device.name.slice(0, 15) }}</span>
			</div>
		</template>
	</Base>
</template>

<script lang="ts">
import { Device } from "@/helpers/types/customdash.summary";
import { defineComponent } from "@vue/runtime-core";
import axios from "axios";
import ms from "ms";
import { Base } from ".";

const MAX_AGE = ms("30m");
const WARNING_AGE = ms("15m");

export default defineComponent({
	data() {
		return { devices: [] as Device[], radius: 42 };
	},
	computed: {
		circumference() {
			return this.radius * 2 * Math.PI;
		},
	},
	methods: {
		openNewTabForDevice(device: Device) {
			window.open(`https://customdash.thies.dev/output/devices/${device.id}`, "_blank");
		},
		getTitleType(device: Device) {
			return device.type.charAt(0).toUpperCase() + device.type.slice(1);
		},
		getIconForDeviceType(device: Device) {
			switch (device.type) {
				case "mobile":
					return ["fas", "mobile"];
				case "laptop":
					return ["fas", "laptop"];
				default:
					return ["fas", "desktop"];
			}
		},
		isInformationTooOld(device: Device, warning = false) {
			return Date.now() - device.lastConnected.time > (warning ? WARNING_AGE : MAX_AGE);
		},
		informationAgeShort(device: Device) {
			return ms(Date.now() - device.lastConnected.time);
		},
		getIconForLTEStrength(device: Device) {
			return ["fas", "signal"];
		},
		getIconForWifiStrength(device: Device) {
			return ["fas", "wifi"];
		},
		getTitleNetwork(device: Device) {
			// Capitalize first letter
			return device.network.type.charAt(0).toUpperCase() + device.network.type.slice(1);
		},
		getIconForNetworkStatus(device: Device) {
			switch (device.network.type) {
				case "wifi":
					return this.getIconForWifiStrength(device);
				case "lte":
					return this.getIconForLTEStrength(device);
				case "ethernet":
					return ["fas", "ethernet"];
				default:
					return ["fas", "plane-up"];
			}
		},
		hasBattery(device: Device) {
			return device.battery !== undefined;
		},
		async getUpdatedDevices() {
			if (window.env.VUE_APP_VERCEL_ENV === "development") {
				return {
					summary: [
						{
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
						},
						{
							type: "mobile",
							name: "OnePlus Nord N10 5G",
							id: "oneplusnord",
							uptime: 231783,
							upsince: 1666211679711,
							battery: 64,
							batteryCharging: false,
							network: {
								ip4: "192.168.1.131",
								ip6: "fe80::1b32:cb0e:5db4:a611",
								up: 0,
								down: 0,
								type: "wifi",
								extraInfo: "- -70",
							},
							connected: false,
							lastConnected: {
								time: 1666443462711,
								ip: "fe80::1b32:cb0e:5db4:a611",
								location: {
									lat: "-",
									lon: "-",
									age: 1666446326000,
								},
							},
						},
					],
					livedata: {
						"-": {
							battery: {
								interval: 5029,
								currentCapacity: 28472,
								voltage: 7.971,
								power: 63.536841,
								percent: 37,
								charging: false,
								dateReceived: 1665666857135,
							},
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
						},
						oneplusnord: {
							network: {
								ip4: "192.168.1.131",
								ip6: "fe80::1b32:cb0e:5db4:a611",
								up: 0,
								down: 0,
								type: "wifi",
								extraInfo: "- -70",
							},
							bluetooth: {
								scanning: true,
								connected: false,
								device: null,
								battery: null,
							},
							battery: {
								percent: 64,
								temperature: 35.5,
								charging: false,
							},
							global: {
								connected: false,
								lastConnected: {
									time: 1666443462711,
									ip: "fe80::1b32:cb0e:5db4:a611",
									location: {
										lat: "-",
										lon: "-",
										age: 1666446326000,
									},
								},
								battery: 64,
							},
						},
					},
					names: {
						"-": {
							type: "laptop",
							os: {
								guid: "-",
								hostname: "thies-zenbook",
								arch: "x64",
								distro: "Ubuntu",
								kernel: "5.19.5-051905-generic",
								platform: "linux",
								release: "22.04.1 LTS",
								uptime: 2390.19,
								upSince: 1665662516,
							},
							cpu: {
								brand: "AMD",
								model: "Ryzen 7 5825U with Radeon Graphics",
								cores: 8,
								threads: 16,
								frequency: 2.56,
							},
							ram: {
								size: 16143405056,
								layout: [
									{
										brand: "Micron Technology",
										type: "LPDDR4",
										frequency: 4266,
									},
									{
										brand: "Micron Technology",
										type: "LPDDR4",
										frequency: 4266,
									},
								],
							},
							storage: {
								layout: [
									{
										device: "nvme0n1",
										brand: "INTEL",
										size: 1024209543168,
										type: "NVMe",
									},
								],
							},
							network: {
								interfaceSpeed: 0,
								type: "",
							},
							battery: {
								hasBattery: true,
								maxCapacity: 74943,
								model: "UM3402",
							},
							dateCreated: 1665664906498,
							connected: false,
							wants: [
								{
									device: "host",
									property: "battery",
								},
								{
									device: "host",
									property: "network",
								},
							],
						},
						oneplusnord: {
							connected: false,
							wants: [],
							type: "mobile",
							battery: {
								hasBattery: true,
							},
							network: {},
							dateCreated: 1666443462711,
							os: {
								guid: "oneplusnord",
								hostname: "OnePlus Nord N10 5G",
								platform: "android",
								distro: "11",
								arch: "BE2029-11",
								uptime: 231783,
								upSince: 1666211679711,
							},
						},
					},
				}.summary;
			}

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
