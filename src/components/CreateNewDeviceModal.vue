<template>
	<Modal ref="modal">
		<template #button>
			<div class="justify-center flex w-full hover:bg-sky-800 rounded-full m-3">
				<div class="w-8 h-8 rounded-full backdrop-blur-sm">
					<font-awesome-icon :icon="['fas', 'plus']" class="w-full h-full" />
				</div>
			</div>
		</template>

		<template #title>Register new device</template>

		<template #content>
			<div class="min-w-[10vw] m-4 p-2">
				<form @submit="addDevice">
					<div class="rounded-md shadow-sm -space-y-px">
						<div>
							<label for="" class="sr-only">Name of device</label>
							<input
								v-model="values.name"
								type="text"
								required
								autofocus
								class="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Name of the device" />
						</div>
						<div>
							<label for="type" class="sr-only">Type of device</label>

							<select
								v-model="values.type"
								required
								class="relative block w-full px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Type of the device">
								<option value="mobile">Mobile</option>
								<option value="desktop">Desktop</option>
							</select>
						</div>
						<div>
							<label for="contact" class="sr-only">Contact URL</label>
							<input
								v-model="values.contact"
								type="text"
								class="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Contact URL (Optional)" />
						</div>
					</div>

					<button
						type="submit"
						:disabled="!allowInput"
						class="group relative w-full flex justify-center mt-10 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:hover:bg-indigo-600">
						Add device
					</button>
				</form>
			</div>
		</template>
	</Modal>
</template>
<script lang="ts">
import { useDevicesStore } from "@/store/device.store";
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {
			values: {
				name: "",
				contact: "",
				type: "mobile",
				availableInformation: [],
			},
		};
	},
	computed: {
		allowInput() {
			return !this.devices.loading.userdata;
		},
	},
	methods: {
		async addDevice(e: Event) {
			e.preventDefault();

			const newDevice = await this.devices.createNewDevice(this.values);
			(this.$refs.modal as any)?.forceClose();
			if (newDevice && this.values.type === "mobile") {
				// Grant new token
				await this.devices.authorizeNewDeviceToken(newDevice.uid);
			}
		},
	},
	setup() {
		const userStore = useUserStore();

		return { user: userStore, devices: useDevicesStore() };
	},
	mounted() {
		// Check route params
		const params = new URLSearchParams(window.location.search);
		if (params.has("contact")) {
			this.values.contact = params.get("contact")!;
			(this.$refs.modal as any)?.forceOpen();
		}
	},
});
</script>
