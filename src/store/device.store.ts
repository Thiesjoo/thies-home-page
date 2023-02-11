import { CreateDevice, Device, DevicesService, UpdateDevice } from "@/generated";
import {
	BatteryLoad,
	CpuLoad,
	FullDevice,
	GlobalLoad,
	LiveData,
	LiveDataList,
	LiveDataSnapshot,
	NetworkLoad,
	Timestamp,
} from "@/helpers/types/pusher.types";
import { RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { useUserStore } from "./user.store";

export const MAX_ARRAY_LENGTH = 20;
const SAMPLE_DEVICE_DATA: Device[] = [
	{
		name: "Sample name",
		type: "laptop1",
		availableInformation: [],
		contact: "",
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
			loading: { userdata: true, dataAlreadyLoaded: false },
			devices: useLocalStorage("devices", [], {
				serializer: StorageSerializers.object,
			}) as RemovableRef<Device[]>,
			socket: { connected: false, connecting: false, error: "" },

			// Array that will be emptied when the socket requests it.
			requests: [] as { deviceID: string; type: string }[],
			livedata: {} as Record<string, LiveDataList>,
		};
	},
	getters: {
		getSpecificDevice: (state) => (deviceID: string) => {
			if (!state.devices) return undefined;
			const info = state.devices.find((device) => device.uid === deviceID);
			const livedata = state.livedata[deviceID];
			return { info, livedata };
		},
		fullDeviceList: function (state) {
			if (!state.devices) return [];

			return state.devices
				.map((x) => {
					const snapshot = Object.entries(state.livedata[x.uid] || {}).reduce((acc, [key, value]) => {
						//@ts-ignore
						acc[key] = value[0];
						return acc;
					}, {} as LiveDataSnapshot);

					return { ...x, livedata: snapshot };
				})
				.filter((x) => x) as FullDevice[];
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
			console.log("New device list loaded", result);

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
			toast.success("Device created successfully!");
			await this.loadDeviceInformation();
		},
		async updateDevice(uid: string, updateDevice: UpdateDevice) {
			const { toast, user } = validateUser();

			const result = await DevicesService.devicesControllerUpdate(uid, updateDevice);
			if (!result) {
				toast.error("Failed to update device!");
				return;
			}
			toast.success("Device updated successfully!");
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

			const allLiveData = await DevicesService.devicesControllerGetAllLiveData();
			allLiveData.forEach((x) => {
				if (!this.livedata[x.deviceID]) {
					this.livedata[x.deviceID] = {};
				}
				this.updateLiveData(x.type, x.data, this.livedata[x.deviceID]);
			});
			console.log("Loaded livedata", allLiveData);

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
						{ deviceID: id, type: "global" },
						{ deviceID: id, type: "battery" },
						{ deviceID: id, type: "network" },
					];
					if (this.devices?.find((x) => x.uid === id)?.type === "mobile") {
						toReturn.push({ deviceID: id, type: "mobile" });
					}
					return toReturn;
				}),
			];
		},
		requestNotifications(device: string) {
			this.requests = [...this.requests, { deviceID: device, type: "notifications" }];
		},
		requestCPUData(device: string) {
			this.requests = [...this.requests, { deviceID: device, type: "cpu" }];
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

		updateLoad(id: string, type: keyof LiveData, data: (GlobalLoad | BatteryLoad) & Timestamp) {
			const { device, livedata } = this.findDevice(id);
			if (!device) return;

			this.updateLiveData(type, data, livedata);
		},

		updateLiveData<T extends keyof LiveData>(key: T, data: LiveData[T] & Timestamp, livedata: LiveDataList) {
			if (!(key in livedata)) {
				livedata[key] = [] as any;
			}
			livedata[key]!.unshift(data);

			if (livedata[key]!.length > MAX_ARRAY_LENGTH) {
				const diff = livedata[key]!.length - MAX_ARRAY_LENGTH;
				//@ts-ignore Nested type errors
				livedata[key] = livedata[key].slice(diff);
			}
		},
	},
});
