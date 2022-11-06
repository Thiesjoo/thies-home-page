import { useLocalStorage, StorageSerializers, RemovableRef } from "@vueuse/core";
import { defineStore } from "pinia";
import { User } from "./user.store";

export type DevicesInfo = {
	api: string;
};

export const useDeviceStore = defineStore("devices", {
	state: () => {
		return {
			loading: { form: false, userdata: false },
			devices: useLocalStorage("devices", null, {
				serializer: StorageSerializers.object,
			}) as RemovableRef<DevicesInfo | null>,
		};
	},

	actions: {
		async getDeviceData() {},
	},
});
