import { defineAsyncComponent } from "vue";

export const Notifications = defineAsyncComponent(() => import("./Notifications.vue"));

export type ValidDeviceComponentNames = "Notifications";
