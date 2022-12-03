<template>
	<!-- Refresh icon in the topright -->
	<div class="absolute top-0 right-0 m-3">
		<font-awesome-icon
			:icon="['fas', 'arrows-rotate']"
			class="text-gray-500 hover:text-gray-700 cursor-pointer"
			@click="forceReloadDevices"
			size="xl"
			title="Refresh devices"></font-awesome-icon>
	</div>

	<!-- Loading indicator -->
	<div
		class="w-screen h-screen fixed flex justify-center items-center overflow-hidden bg-stone-300/50"
		v-if="loading">
		<div role="status ">
			<svg
				aria-hidden="true"
				class="mr-2 w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
				viewBox="0 0 100 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path
					d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					fill="currentColor" />
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill" />
			</svg>
			<span class="sr-only">Loading...</span>
		</div>
	</div>

	<!-- For every device in the list, get 1/4 of page width and make a nice looking colunm -->
	<div class="total-container w-[100vw] h-[100vh] flex flex-row justify-center">
		<div v-for="device in devices" class="single-container w-[25vw] p-2 m-3">
			<!-- Header -->
			<div class="header-container">
				<div class="flex flex-row justify-between">
					<!-- Device info -->
					<div class="flex flex-col space-y-1 max-w-[40%]">
						<span class="text-lg font-bold">
							<font-awesome-icon
								:icon="getIconForDeviceType(device)"
								:title="getTitleType(device)"
								class="mr-1">
							</font-awesome-icon
							>{{ device.name }}</span
						>
						<span class="text-sm italic">{{ device.id }}</span>
					</div>

					<div class="flex flex-col space-y-1 min-w-[50%] text-right">
						<!-- Device status -->
						<span class="text-lg font-bold">
							{{ informationAgeShort(device, now) }} -
							<div
								class="w-[12px] h-[12px]"
								:style="{
									'background-color': getColorForAge(device, now),
									'border-radius': '50%',
									display: 'inline-block',
								}"></div
						></span>

						<!-- Network -->
						<span class="text-sm font-bold" :title="getNetworkTitle(device, true)">
							<font-awesome-icon
								:icon="getIconForNetworkStatus(device)"
								:title="getNetworkTypeTitle(device)">
							</font-awesome-icon>
							{{ getNetworkTitle(device) }}
						</span>

						<!-- Battery -->
						<span class="text-sm font-bold whitespace-nowrap" v-if="device.battery && device.battery != 0">
							<font-awesome-icon :icon="['fas', 'battery']" class="mr-1" v-if="!device.batteryCharging">
							</font-awesome-icon>
							<font-awesome-icon :icon="['fas', 'bolt']" class="mr-1" v-if="device.batteryCharging">
							</font-awesome-icon>

							<span> {{ device.battery }}% </span>
							<div class="w-[60%] rounded-full h-2.5 bg-gray-700 inline-block">
								<div
									class="0 h-2.5 rounded-full"
									:class="getColorForBattery(device, true)"
									:style="{
										width: device.battery + '%',
									}"></div>
							</div>
						</span>
					</div>
				</div>
			</div>

			<!-- Body -->
			<!-- TODO: Blur body when information gets too old -->
			<div class="flex flex-col space-y-2"></div>
		</div>
	</div>
</template>

<script lang="ts">
import errorCaptured from "@/components/widgets/errorCaptured";
import { allHelperFunctions } from "@/helpers/remoteDevices";
import { useDevicesStore } from "@/store/device.store";
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "@vue/runtime-core";
import SocketService from "@/services/socket.service";

export default defineComponent({
	data() {
		return {
			interval: null as number | null,
			// Refresh things such as dates
			now: Date.now(),
		};
	},
	errorCaptured,
	setup() {
		const user = useUserStore();

		return { user, devicesStore: useDevicesStore() };
	},
	computed: {
		loading() {
			return this.devicesStore.loading.userdata;
		},
		devices() {
			return this.devicesStore.devices?.summary || [];
		},
	},
	methods: {
		...allHelperFunctions,
		forceReloadDevices() {
			// Force reload the data
			this.devicesStore.loadDeviceData();
		},
	},
	beforeDestroy() {
		SocketService.disconnect();
		if (this.interval) clearInterval(this.interval);
	},
	beforeUnmount() {
		SocketService.disconnect();
		if (this.interval) clearInterval(this.interval);
	},
	beforeRouteLeave() {
		SocketService.disconnect();
		if (this.interval) clearInterval(this.interval);
	},
	async mounted() {
		const self = this;
		this.user.$subscribe((mutation, state) => {
			if (state.loggedIn && !state.loading.userdata && !this.interval) {
				this.forceReloadDevices();

				this.interval = setInterval(function () {
					self.now = Date.now();
				}, 1000);
			}
		});

		await SocketService.setupSocketConnection();

		SocketService.onConnected(() => {
			console.log("connected in mounted");
			this.devicesStore.requestGlobalData();
		});

		SocketService.onNewDevice((device) => {
			console.log("New device added", device);
			this.devicesStore.requestGlobalData();
		});
	},
});
</script>
<style>
.total-container {
	background: linear-gradient(120deg, #1e3c72 0%, #331c6a 100%);
}

.single-container {
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 10px;
	max-width: 450px;
}

.header-container {
	background: rgba(255, 255, 255, 0.1);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 10px;

	padding: 1em;
	margin-bottom: 2em;
}
</style>