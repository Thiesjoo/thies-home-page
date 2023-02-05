<template>
	<div class="max-h-[80%]">
		Notifications

		<div class="flex flex-col items-center space-y-4 p-1 overflow-y-scroll h-[80vh]">
			<div
				v-for="notf in notifications"
				class="flex flex-col items-start space-y-2 bg-slate-200 rounded-md w-full p-2">
				<div class="nowrap">
					<div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
						<img v-if="images[notf.icon]" :src="getURLforImg(notf.icon)" class="w-6 h-6" />
					</div>
					- {{ notf.app }}
				</div>
				<div>
					<span class="font-bold">{{ notf.title }}</span>
				</div>
				<div>{{ notf.text }}</div>

				<div>{{ notf.button1text }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Device } from "@/generated/models/Device";
import { getDeviceBaseURL } from "@/helpers/auto-refresh-tokens";
import { useDevicesStore } from "@/store/device.store";
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		device: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			notifications: [] as {
				id: string;
				title: string;
				text: string;
				icon: string;
				pkg: string;
				app: string;
				button1text: string;
			}[],
			images: {} as Record<string, string>,
		};
	},
	methods: {
		getURLforImg(icon: string) {
			return this.images[icon];
		},
	},
	setup(props) {
		return { devices: useDevicesStore(), current: props.device as Device };
	},
	// TODO: FIX THISSSSS
	// It still leaks tons of memory (i think)
	beforeUnmount() {
		Object.entries(this.images).forEach(([key, value]) => {
			URL.revokeObjectURL(value);
		});
	},

	async mounted() {
		return;
		console.log("test", this.current);
		this.devices.requestNotifications(this.current.uid);
		const tes = await axios.get(getDeviceBaseURL() + `/output/devices/${this.current.uid}/notifs`);
		console.log(tes.data);
		this.notifications = tes.data.notifs;
		const self = this;
		tes.data.notifs.forEach((x: { icon: string }) => {
			axios
				.get(
					getDeviceBaseURL() + `/output/devices/${this.current.uid}/icons/${x.icon.replace("multer://", "")}`,
					{
						responseType: "blob",
					}
				)
				.then((response) => {
					self.images[x.icon] = URL.createObjectURL(response.data);
					// console.log(URL.createObjectURL(x.data));
				});
		});
	},
});
</script>
