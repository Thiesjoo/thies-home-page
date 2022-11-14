import { Device } from "@/helpers/types/customdash.summary";
import { BatteryLoad, GlobalLoad, NetworkLoad } from "@/helpers/types/pusher.types";
import { useLocalStorage, StorageSerializers, RemovableRef } from "@vueuse/core";
import axios from "axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { User, useUserStore } from "./user.store";

export type DevicesInfo = {
	api: string;
	summary: Device[];
	extraInfo: Record<string, {}>;
};

const sampleData = [
	{
		type: "laptop",
		name: "thies-zenbook",
		id: "test",
		uptime: 2390.19,
		upsince: 1665662516,
		battery: 37,
		batteryCharging: true,
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
			extraInfo: "RandomWifiNetwork -70",
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
];

export const useDevicesStore = defineStore("devices", {
	state: () => {
		return {
			loading: { userdata: true },
			devices: useLocalStorage("devices", null, {
				serializer: StorageSerializers.object,
			}) as RemovableRef<DevicesInfo | null>,
			socket: { connected: false, connecting: false, error: "" },

			// Array that will be emptied when the socket requests it.
			requests: [] as { deviceId: string; type: string }[],
		};
	},

	actions: {
		async loadDeviceData() {
			const toast = useToast();
			const user = useUserStore();
			// If user is not logged in, return
			if (!user.user) {
				toast.error("You are not logged in!");
				throw new Error("Trying to fetch devices, but user not logged in");
			}

			// If user is logged in, get device data
			this.loading.userdata = true;

			// Fetch data
			if (false && window.env.VUE_APP_VERCEL_ENV === "development") {
				this.devices = {
					api: "http://localhost:3001",
					summary: sampleData,
					extraInfo: {},
				};
			} else {
				this.devices = {
					api: "https://testing.thies.dev",
					summary: [],
					extraInfo: {},
				};
			}

			const data = (await axios.get(`${this.devices.api}/output/summary`)).data;

			this.devices.summary = data.summary;

			this.loading.userdata = false;
		},

		requestGlobalData(shownDevices: string[] = []) {
			if (shownDevices.length === 0) {
				this.devices?.summary.forEach((x) => {
					shownDevices.push(x.id);
				});
			}
			this.requests = [
				...this.requests,
				...shownDevices.flatMap((id) => [
					{ deviceId: id, type: "global" },
					{ deviceId: id, type: "battery" },
					{ deviceId: id, type: "network" },
				]),
			];
		},

		emptyRequests() {
			this.requests = [];
		},

		findDevice(id: string) {
			if (!this.devices) return null;
			const device = this.devices.summary.find((d) => d.id === id);
			if (!device) {
				console.warn("Tried to update: ", id, "but it does not exist");
				return null;
			}
			return device;
		},

		updateGlobalLoad(id: string, data: GlobalLoad) {
			const device = this.findDevice(id);
			if (!device) return;

			device.connected = data.connected;
			device.lastConnected = data.lastConnected;
		},
		updateBatteryLoad(id: string, data: BatteryLoad) {
			const device = this.findDevice(id);
			if (!device) return;

			device.battery = data.percent;
			device.batteryCharging = data.charging;
		},
		updateNetworkLoad(id: string, data: NetworkLoad) {
			const device = this.findDevice(id);
			if (!device) return;

			device.network = data;
		},
	},
});
