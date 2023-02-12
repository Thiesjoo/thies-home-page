<template>
	<Modal ref="modal" :color="deviceColor">
		<template #button> <slot name="button"> </slot> </template>

		<template #title
			><span class="w-[90%]">Device management: {{ device.name }}</span></template
		>

		<template #content>
			<div class="min-w-[15vw] m-10 p-3">
				<form @submit="updateDevice">
					<div class="rounded-md shadow-sm -space-y-px">
						<div>
							<label for="" class="sr-only">Name of device</label>
							<input
								v-model="device.name"
								type="text"
								required
								disabled
								class="bg-slate-400 appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Name of the device" />
						</div>
						<div>
							<label for="type" class="sr-only">Type of device</label>

							<select
								v-model="device.type"
								required
								disabled
								class="bg-slate-400 opacity-100 pl-3 appearance-none relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Type of the device">
								<option value="mobile">Mobile</option>
								<option value="desktop">Desktop</option>
							</select>
						</div>
						<div>
							<label for="contact" class="sr-only">Contact URL</label>
							<input
								v-model="device.contact"
								type="text"
								class="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Contact URL (Optional)" />
						</div>
					</div>
					<button
						type="submit"
						class="group relative w-full flex justify-center mt-5 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:hover:bg-indigo-600">
						Update device
					</button>
				</form>

				<div class="flex items-center w-full mt-5 mb-5">
					<div class="flex-grow bg bg-gray-300 h-0.5"></div>
					<div class="flex-grow-0 mx-5 text dark:text-white">Info</div>
					<div class="flex-grow bg bg-gray-300 h-0.5"></div>
				</div>
				<h4 class="font-bold text-xl">Available specs</h4>
				<ul>
					<li v-for="info in device.availableInformation">{{ info }}</li>
				</ul>
				<div class="flex items-center w-full mt-5 mb-5">
					<div class="flex-grow bg bg-gray-300 h-0.5"></div>
					<div class="flex-grow-0 mx-5 text dark:text-white">Tokens</div>
					<div class="flex-grow bg bg-gray-300 h-0.5"></div>
				</div>
				<button
					@click="authorizeToken()"
					class="group relative w-full flex justify-center mt-5 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:hover:bg-indigo-600">
					Authorize new token
				</button>
			</div>
		</template>
	</Modal>
</template>
<script lang="ts">
import { DevicesService } from "@/generated";
import { Device } from "@/generated/models/Device";
import { colorFromString, lightenDarkenColor } from "@/helpers/colors";
import { useDevicesStore } from "@/store/device.store";
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";

export default defineComponent({
	props: {
		deviceToShow: {
			type: Object,
		},
	},
	data() {
		return {};
	},
	computed: {
		device(): Device {
			return this.$props.deviceToShow as Device;
		},
		deviceColor(): string {
			return lightenDarkenColor(colorFromString(this.device.uid), -50);
		},
	},
	methods: {
		async updateDevice(e: Event) {
			e.preventDefault();

			await this.devices.updateDevice(this.device.uid, this.device);
		},
		async authorizeToken() {
			this.devices.authorizeNewDeviceToken(this.device.uid);
		},
	},
	setup(props) {
		const userStore = useUserStore();

		return { user: userStore, devices: useDevicesStore() };
	},
});
</script>
