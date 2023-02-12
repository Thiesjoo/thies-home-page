<template>
	<div class="max-h-[80%]">
		Notifications

		<div class="flex flex-col items-center space-y-4 p-1 overflow-y-scroll h-[80vh]">
			<div
				v-for="notf in notifications"
				class="flex flex-col items-start space-y-2 bg-slate-500 rounded-md w-full p-2">
				<div class="nowrap w-full flex flex-row items-center">
					<div
						class="w-8 h-8 rounded-full mr-2 flex items-center justify-center"
						:class="{
							'bg-red-500': !images[notf.icon],
						}">
						<img v-if="images[notf.icon]" :src="getURLforImg(notf.icon)" class="w-8 h-8" />
					</div>
					<span class="font-light"> {{ notf.appname }} </span>

					<div class="ml-auto" style="order: 2" :title="formatDate(new Date(notf.timestamp))">
						<i> {{ ms(now - +notf.timestamp) }} ago </i>
					</div>
				</div>
				<div>
					<span class="font-bold">{{ notf.title }}</span>
				</div>
				<div>{{ notf.text }}</div>

				<!-- <div>{{ notf.click_action }}</div> -->
			</div>
		</div>

		<div>
			<button class="appearance-none bg-slate-200 rounded-full p-2" @click="clearAll">
				Clear all notifications
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Device, Notification, NotificationsService } from "@/generated";
import { getDeviceBaseURL } from "@/helpers/auto-refresh-tokens";
import { formatDate } from "@/helpers/formatDate";
import { useDevicesStore } from "@/store/device.store";
import axios from "axios";
import ms from "ms";
import { defineComponent, toRaw, unref } from "vue";
import { useToast } from "vue-toastification";

export default defineComponent({
	props: {
		device: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			notifications: [] as Notification[],
			images: {} as Record<string, string>,
			notfSub: undefined as undefined | (() => void),
			vueTrigger: true,
			now: Date.now(),
			interval: 0,
		};
	},
	methods: {
		getURLforImg(icon: string) {
			return this.images[icon];
		},
		formatDate,
		ms,
		loadImage(notf: Notification, retry = 0) {
			axios
				.get(getDeviceBaseURL() + `/notifications/image/${notf.icon}`, {
					responseType: "blob",
				})
				.then((response) => {
					this.images[notf.icon] = URL.createObjectURL(response.data);
					this.vueTrigger = !this.vueTrigger;
				})
				.catch((e) => {
					console.error("Failed to load image", e);

					if (retry > 2) return;
					setTimeout(() => {
						this.loadImage(notf, retry + 1);
					}, 1000 * retry);
				});
		},
		clearAll() {
			const toast = useToast();
			NotificationsService.notificationsControllerDeleteAllForDevice(this.current.uid).catch((e: any) => {
				console.error("Failed to clear notifications", e);
				toast.error("Failed to clear notifications");
			});
		},
	},
	setup(props) {
		return { devices: useDevicesStore(), current: props.device as Device };
	},
	beforeUnmount() {
		Object.entries(this.images).forEach(([key, value]) => {
			URL.revokeObjectURL(value);
		});
		clearInterval(this.interval);
	},

	async mounted() {
		this.devices.requestNotifications(this.current.uid);

		const result = await NotificationsService.notificationsControllerFindForDevice(this.current.uid);
		this.notifications = result;

		this.devices.$subscribe((mut, state) => {
			if (
				state.livedata[this.current.uid]?.notifications &&
				state.livedata[this.current.uid].notifications!.length > 0
			) {
				const rawNotificationList = toRaw(state.livedata[this.current.uid].notifications!);
				console.log("Processing:", rawNotificationList);
				rawNotificationList.forEach((x) => {
					if (x.removed) {
						this.notifications = this.notifications.filter((y) => {
							if (y.uid !== x.uid) return true;

							if (y.icon) {
								console.log("Revoked removed image!", y.icon);
								setTimeout((() => URL.revokeObjectURL(this.images[y.icon])).bind(this), 1);
							}
							return false;
						});
					} else {
						this.notifications.push(x);

						// The phone should have loaded the image by now
						// TODO: Implement listener for when the image is loaded
						setTimeout(
							(() => {
								this.loadImage(x);
							}).bind(this),
							500
						);
					}
				});

				this.vueTrigger = !this.vueTrigger;
				state.livedata[this.current.uid].notifications = [];
			}
		});

		const self = this;
		this.interval = setInterval(async function () {
			self.now = Date.now();
		}, 1000) as unknown as number;

		console.log("Notification list loaded:", result);
		this.notifications.forEach(this.loadImage.bind(this));
	},
});
</script>
