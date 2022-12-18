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
									class="bg-gray-900 rounded-md m-3 p-2 flex flex-row items-center text-lg">
									<font-awesome-icon :icon="['fas', 'key']" class="mr-2" />
									<span class="font-bold text-base">{{ passkey.name }}</span>

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
import ms from "ms";
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {
			...window.env,
			open: true,
			passkeys: [
				{ name: "test", lastUsed: 1000, createdAt: 1000, counter: 0, id: "0b1" },
				{ name: "test", lastUsed: 1000, createdAt: 1000, counter: 0, id: "0b1" },
			],
		};
	},
	methods: {
		toggle() {
			this.open = !this.open;
		},
		deletePasskey(id: string) {
			console.warn("Deleting passkey with id: ", id);
		},
		humanizeDuration(date: number) {
			return ms(Date.now() - date, { long: true });
		},
	},
	setup() {
		return { user: useUserStore() };
	},
});
</script>
<style>
td {
	padding: 5px 15px;
}
</style>
