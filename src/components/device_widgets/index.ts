import { defineAsyncComponent } from "vue";

export const Notifications = defineAsyncComponent(() => import("./Notifications.vue"));
export const CPU = defineAsyncComponent(() => import("./cpu.vue"));
export const RAM = defineAsyncComponent(() => import("./ram.vue"));

export type ValidDeviceComponentNames = "Notifications" | "CPU" | "RAM";
export const ValidDeviceComponents = {
	Notifications,
	CPU,
	RAM,
};
