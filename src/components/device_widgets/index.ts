import { defineAsyncComponent } from "vue";

export const Notifications = defineAsyncComponent(() => import("./Notifications.vue"));
export const CPU = defineAsyncComponent(() => import("./cpu.vue"));

export type ValidDeviceComponentNames = "Notifications" | "CPU";
