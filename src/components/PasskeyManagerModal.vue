<template>
	<div>
		<a
			class="text-white no-underline border border-transparent py-2 px-4 flex flex-row justify-center items-center rounded-md mx-2"
			style="background-color: rgb(102, 96, 102)"
			@click="open = true">
			<font-awesome-icon :icon="[`fas`, `lock`]" class="mr-2" />
			Manage Passkeys
		</a>
		<div>
			<div
				class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full flex justify-center items-center"
				v-if="open"
				v-click-outside="toggle">
				<div class="relative p-8 w-full max-w-2xl h-full md:h-auto z-100">
					<div class="relative rounded-lg shadow bg-gray-800">
						<div class="flex justify-between items-start p-5 rounded-t border-b border-gray-600">
							<h2 class="mt-6 text-center w-full text-3xl font-extrabold">Manage Passkeys</h2>
							<button
								type="button"
								@click="toggle"
								class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white">
								<font-awesome-icon :icon="['fas', 'xmark']" size="lg" />
							</button>
						</div>
						<div class="pt-1 p-6 space-y-6 text-base leading-relaxed text-gray-400">
							<div class="flex items-center flex-col space-y-2" v-if="!user.loading.userdata">
								<div
									v-for="passkey in passkeys"
									class="bg-gray-900 rounded-md m-3 p-2 flex flex-row items-center text-lg w-[75%]">
									<font-awesome-icon :icon="['fas', 'key']" class="mr-2" size="lg" />
									<span class="font-bold text-base flex flex-row align-center items-center"
										>{{ passkey.nickname }}

										<font-awesome-icon
											:icon="['fas', 'edit']"
											size="xs"
											class="ml-2 text-gray-100 opacity-50 hover:opacity-100 hover:text-gray-200"
											@click="() => editPasskey(passkey.id)" />
									</span>

									<div class="ml-5 flex flex-col align-center w-[75%] font-light text-xs">
										<span>Last used: {{ humanizeDuration(passkey.lastUsed) }} ago</span>
										<span>Created: {{ humanizeDuration(passkey.createdAt) }} ago</span>
										<span>Used {{ passkey.counter }} times</span>
									</div>

									<div @click="() => deletePasskey(passkey.id)">
										<font-awesome-icon :icon="['fas', 'trash']" class="ml-5 text-red-500" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { useUserStore } from "@/store/user.store";
import axios from "axios";
import ms from "ms";
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";

export default defineComponent({
	data() {
		return {
			...window.env,
			open: false,
			passkeys: [] as {
				nickname: string;
				lastUsed: number;
				createdAt: number;
				counter: number;
				id: string;
			}[],
		};
	},
	methods: {
		toggle() {
			this.open = !this.open;
		},
		async deletePasskey(id: string) {
			console.warn("Deleting passkey with id: ", id);
			const result = confirm(
				"Are you sure you want to delete this passkey? We cannot delete it from your device, but we can invalidate it"
			);
			if (result) {
				await axios.delete(`/api/authenticator/${id}`);
				this.toast.success("Passkey deleted!");
			} else {
				this.toast.error("Passkey not deleted!");
			}

			this.loadPasskeys();
		},
		async editPasskey(id: string) {
			const result = prompt("Enter a new nickname for this passkey:");
			if (!result) {
				this.toast.error("You must enter a nickname!");
				return;
			}
			await axios.patch(`/api/authenticator/${id}`, { nickname: result });

			this.loadPasskeys();
		},
		humanizeDuration(date: number) {
			return ms(Date.now() - date, { long: true });
		},
		async loadPasskeys() {
			this.passkeys = (await axios.get("/api/authenticator"))?.data;
		},
	},
	setup() {
		return { user: useUserStore(), toast: useToast() };
	},
	mounted() {
		this.loadPasskeys();
	},
});
</script>
<style>
td {
	padding: 5px 15px;
}
</style>
