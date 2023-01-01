import { defineAsyncComponent } from "vue";

export { default as Base } from "./Base.vue";
export const Pauze = defineAsyncComponent(() => import("./Pauze.vue"));
export const VIA = defineAsyncComponent(() => import("./VIA.vue"));
export const Twitch = defineAsyncComponent(() => import("./Twitch.vue"));
export const Spotify = defineAsyncComponent(() => import("./Spotify.vue"));
export const Battery = defineAsyncComponent(() => import("./BatteryWidget.vue"));
export const Dummy = defineAsyncComponent(() => import("./Dummy.vue"));
export const RemoteDevices = defineAsyncComponent(() => import("./RemoteDevices.vue"));

export type ValidComponentNames = "Pauze" | "VIA" | "Twitch" | "Spotify" | "Battery" | "Dummy" | "RemoteDevices";
