<template>
	<Base
		:loaded="devices.length > 0"
		v-for="device in devices"
		v-bind="$attrs"
		@mouseleave="open[device.uid] = false"
		@mouseover="open[device.uid] = true">
		<template #content>
			<div class="flex flex-col justify-center m-0 p-0 text-center">
				<div class="inline-flex items-center justify-center overflow-hidden rounded-full">
					<!-- TODO: This still displays battery info, even if there is no battery -->
					<svg class="w-20 h-20 -rotate-90 z-10">
						<circle
							style="color: #222222"
							stroke-width="20"
							stroke="currentColor"
							fill="transparent"
							:r="radius"
							cx="40"
							cy="40" />
						<circle
							:class="getColorForBattery(device)"
							stroke-width="19"
							:stroke-dasharray="circumference"
							:stroke-dashoffset="circumference * (1 - (device.livedata?.battery?.percent || 100) / 100)"
							stroke="currentColor"
							fill="transparent"
							:r="radius"
							cx="40"
							cy="40" />
						<circle
							v-if="device.livedata?.battery?.charging"
							class="text-gray-400/50 animate-charging"
							:style="{
								'--max': circumference * (1 - (device.livedata?.battery?.percent || 100) / 100),
								'--r': circumference,
							}"
							stroke-width="19"
							:stroke-dasharray="circumference"
							stroke="currentColor"
							fill="transparent"
							:r="radius"
							cx="40"
							cy="40" />
					</svg>

					<!-- All device info -->
					<div class="absolute text-md flex flex-col z-10">
						<div class="flex flex-row justify-center space-x-1">
							<font-awesome-icon
								:icon="getIconForDeviceType(device)"
								:title="getTitleType(device)"
								style="font-size: 2em">
							</font-awesome-icon>
						</div>

						<span class="text-blue-700 text-center p-1"
							>{{ device.livedata?.battery?.percent || 100 }}%
						</span>
					</div>
				</div>

				<Transition
					enter-active-class="transition ease-out duration-200"
					enter-class="transform opacity-0 scale-95"
					enter-to-class="transform opacity-100 scale-100"
					leave-active-class="transition ease-in duration-175"
					leave-class="transform opacity-100 scale-100"
					leave-to-class="transform opacity-0 scale-95">
					<div
						class="absolute ml-15 p-2 pl-10 rounded-full text-md flex flex-col w-[20rem] h-24 z-0 space-y-2"
						style="background-color: #181818"
						v-if="open[device.uid]">
						<span :title="device.name" class="font-bold">{{ device.name }}</span>
						<!-- Icons -->
						<div class="flex flex-row justify-center space-x-1">
							<font-awesome-icon
								:icon="['fas', 'hourglass']"
								class="text-red-600"
								v-if="isInformationTooOld(device, now)"
								title="We haven't received any information from this device for a while.">
							</font-awesome-icon>
							<font-awesome-icon
								:icon="getIconForNetworkStatus(device)"
								:title="getNetworkTypeTitle(device)">
							</font-awesome-icon>
							<font-awesome-icon
								:icon="['fas', 'bolt']"
								v-if="device.livedata?.battery?.charging"
								title="Battery is charging">
							</font-awesome-icon>
							<font-awesome-icon
								:icon="['fas', 'ban']"
								v-if="device.livedata?.mobile?.dnd"
								title="Do Not Disturb is on">
							</font-awesome-icon>
							<font-awesome-icon
								:icon="['fas', 'house-signal']"
								v-if="device.livedata?.mobile?.hotspot"
								title="Hotspot is enabled">
							</font-awesome-icon>
						</div>

						<span :title="device.livedata.network?.extraInfo" class="italic">{{
							device.livedata.network?.extraInfo
						}}</span>
						<span
							class="text-[12px] text-center"
							:style="{
								color: getColorForAge(device, now),
							}"
							>Last contact: {{ informationAgeShort(device, now) }}
						</span>
					</div>
				</Transition>
			</div>
		</template>
	</Base>
</template>

<script lang="ts">
import { allHelperFunctions, getColorForBattery, getIconForDeviceType, getTitleType } from "@/helpers/remoteDevices";
import { FullDevice } from "@/helpers/types/pusher.types";
import SocketService from "@/services/socket.service";
import { useDevicesStore } from "@/store/device.store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineComponent } from "@vue/runtime-core";
import { Base } from ".";

const WAIT_FOR_SOCKET = 5;

export default defineComponent({
	data() {
		return { radius: 42, now: Date.now(), interval: null as number | null, open: {} as Record<string, boolean> };
	},
	computed: {
		circumference() {
			return this.radius * 2 * Math.PI;
		},
		devices(): FullDevice[] {
			return this.devicesStore.fullDeviceList ?? [];
		},
	},
	methods: {
		...allHelperFunctions,
	},
	async mounted() {
		if (this.$attrs.sample) {
			this.devicesStore.loadDeviceInformation(true);

			return;
		}

		let secondsRunning = 0;
		const self = this;
		this.interval = setInterval(async function () {
			self.now = Date.now();
			secondsRunning++;
			if (secondsRunning === WAIT_FOR_SOCKET) {
				console.log(`Page open for ${WAIT_FOR_SOCKET} seconds, establishing socket connectiong`);
				await SocketService.setupSocketConnection();
				SocketService.onConnected(() => {
					console.log("connected in mounted");
					self.devicesStore.requestGlobalData();
				});
			}
		}, 1000) as unknown as number;
		this.devicesStore.loadDeviceInformation();
		this.devicesStore.loadLiveData();
	},
	beforeUnmount() {
		SocketService.disconnect();

		if (this.interval) {
			clearInterval(this.interval);
		}
	},
	setup() {
		return { devicesStore: useDevicesStore() };
	},
	components: { Base },
});
</script>

<style>
.animate-charging {
	animation: dash 2.5s linear forwards;
	animation-iteration-count: infinite;
}
@keyframes dash {
	from {
		stroke-dashoffset: var(--r);
	}
	to {
		stroke-dashoffset: var(--max);
	}
}
</style>
