import { CreateDevice, Device, DevicesService } from "@/generated";
import { getDeviceBaseURL } from "@/helpers/auto-refresh-tokens";
import {
	BatteryLoad,
	CpuLoad,
	GlobalLoad,
	LiveData,
	LiveDataList,
	NetworkLoad,
	PossibleLiveDataKeys,
} from "@/helpers/types/pusher.types";
import { useLocalStorage, StorageSerializers, RemovableRef } from "@vueuse/core";
import axios from "axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { User, useUserStore } from "./user.store";

export const MAX_ARRAY_LENGTH = 20;
export type Timestamp = { dateReceived: number };

export type DevicesInfo = {
	api: string;
	summary: Device[];
};

const SAMPLE_DEVICE_DATA: Device[] = [
	{
		name: "string",
		type: "string",
		availableInformation: [],
		contact: "string",
		uid: "63dea51d6c59ad78f80d9497",
	},
];

const validateUser = () => {
	const toast = useToast();
	const user = useUserStore();
	// If user is not logged in, return
	if (!user.user) {
		toast.error("You are not logged in!");
		throw new Error("Trying to fetch devices, but user not logged in");
	}

	return { toast, user };
};

export const useDevicesStore = defineStore("devices", {
	state: () => {
		return {
			loading: { userdata: false, dataAlreadyLoaded: false },
			devices: useLocalStorage("devices", null, {
				serializer: StorageSerializers.object,
			}) as RemovableRef<Device[] | null>,
			socket: { connected: false, connecting: false, error: "" },

			// Array that will be emptied when the socket requests it.
			requests: [] as { deviceId: string; type: string }[],
			livedata: {} as Record<string, LiveDataList>,
		};
	},
	getters: {
		getSpecificDevice: (state) => (deviceId: string) => {
			if (!state.devices) return undefined;
			const info = state.devices.find((device) => device.uid === deviceId);
			const livedata = state.livedata[deviceId];
			return { info, livedata };
		},
	},
	actions: {
		async loadDeviceInformation(sample = false) {
			const { toast, user } = validateUser();

			if (sample) {
				this.devices = SAMPLE_DEVICE_DATA;
				return;
			}

			this.loading.userdata = true;
			const result = await DevicesService.devicesControllerFindAll();
			this.devices = result;

			this.loading.dataAlreadyLoaded = true;
			this.loading.userdata = false;
		},

		async createNewDevice(device: CreateDevice) {
			const { toast, user } = validateUser();

			const result = await DevicesService.devicesControllerCreate(device);
			if (!result) {
				toast.error("Failed to create device!");
				return;
			}
			await this.loadDeviceInformation();
		},

		async loadLiveData(sample = false) {
			const toast = useToast();
			const user = useUserStore();
			// If user is not logged in, return
			if (!user.user) {
				toast.error("You are not logged in!");
				throw new Error("Trying to fetch devices, but user not logged in");
			}

			// If user is logged in, get device data
			this.loading.userdata = true;

			const test = await DevicesService.devicesControllerGetAllLiveData();
			console.log(test);

			this.loading.userdata = false;
		},

		// Related to sockets
		requestGlobalData(shownDevices: string[] = []) {
			if (shownDevices.length === 0) {
				this.devices?.forEach((x) => {
					shownDevices.push(x.uid);
				});
			}
			this.requests = [
				...this.requests,
				...shownDevices.flatMap((id) => {
					const toReturn = [
						{ deviceId: id, type: "global" },
						{ deviceId: id, type: "battery" },
						{ deviceId: id, type: "network" },
					];
					if (this.devices?.find((x) => x.uid === id)?.type === "mobile") {
						toReturn.push({ deviceId: id, type: "mobile" });
					}
					return toReturn;
				}),
			];
		},
		requestNotifications(device: string) {
			this.requests = [...this.requests, { deviceId: device, type: "notifications" }];
		},
		requestCPUData(device: string) {
			this.requests = [...this.requests, { deviceId: device, type: "cpu" }];
		},

		emptyRequests() {
			this.requests = [];
		},

		findDevice(id: string) {
			if (!this.devices) return { device: null, livedata: null };

			const device = this.devices.find((d) => d.uid === id);
			if (!device) {
				console.warn("Tried to update: ", id, "but it does not exist");
				return { device: null, livedata: null };
			}
			if (!this.livedata[id]) {
				this.livedata[id] = {};
			}

			return { device, livedata: this.livedata[id] };
		},

		// Processing functions
		updateGlobalLoad(id: string, data: GlobalLoad & Timestamp) {
			const { device, livedata } = this.findDevice(id);
			if (!device) return;

			// device.connected = data.connected;
			// device.lastConnected = data.lastConnected;
		},
		updateBatteryLoad(id: string, data: BatteryLoad & Timestamp) {
			const { device, livedata } = this.findDevice(id);
			if (!device) return;

			// device.battery = data.percent;
			// device.batteryCharging = data.charging;
			this.updateLiveData("battery", data, livedata);
		},
		updateNetworkLoad(id: string, data: NetworkLoad & Timestamp) {
			const { device, livedata } = this.findDevice(id);
			if (!device) return;

			device.network = data;
			if (device.type !== "mobile") {
				this.updateLiveData("network", data, livedata);
			}
		},
		updateCPULoad(id: string, data: CpuLoad & Timestamp) {
			const { device, livedata } = this.findDevice(id);
			if (!device) return;

			this.updateLiveData("cpu", data, livedata);
		},

		updateLiveData<T extends PossibleLiveDataKeys>(
			key: T,
			data: LiveData[T] & Timestamp,
			livedata: { [K in keyof LiveData]: Array<LiveData[K] & Timestamp> }
		) {
			if (!(key in livedata)) {
				livedata[key] = [] as any;
			}
			livedata[key]!.push(data);

			if (livedata[key].length > MAX_ARRAY_LENGTH) {
				const diff = livedata[key].length - MAX_ARRAY_LENGTH;
				//@ts-ignore Nested type errors
				livedata[key] = livedata[key].slice(diff);
			}
		},
	},
});
