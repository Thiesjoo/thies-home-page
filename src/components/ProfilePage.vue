<template>
	<div class="flex items-center flex-col space-y-2" v-if="!user.loading.userdata">
		<button class="p-3" @click="() => registerNewToken(true, 'passkey')">
			Register new passkey (Username on token)
		</button>
		<button class="p-3" @click="() => registerNewToken(false, 'passwordless')">
			Register new passwordless key (Enter username on each login)
		</button>

		<span>Username: {{ user.user?.name }}</span>
		<span>Email: {{ user.user?.email }}</span>

		<label for="seconds-toggle" class="inline-flex relative items-center cursor-pointer">
			<input
				type="checkbox"
				id="seconds-toggle"
				class="sr-only peer"
				@change="change"
				:checked="user.user?.settings.showSeconds"
			/>
			<div
				class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-teal-500 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
			></div>
			<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show seconds on time</span>
		</label>
		<label for="date-toggle" class="inline-flex relative items-center cursor-pointer">
			<input
				type="checkbox"
				id="date-toggle"
				class="sr-only peer"
				@change="change"
				:checked="user.user?.settings.showDate"
			/>
			<div
				class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-teal-500 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
			></div>
			<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show date on top of screen</span>
		</label>
		<label for="version-toggle" class="inline-flex relative items-center cursor-pointer">
			<input
				type="checkbox"
				id="version-toggle"
				class="sr-only peer"
				@change="change"
				:checked="user.user?.settings.showVersion"
			/>
			<div
				class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-teal-500 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
			></div>
			<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show version modal in bottom right</span>
		</label>

		<div class="flex flex-col items-center justify-center w-9/12 text-sm pt-5">
			<h3>Link a new account</h3>
			<div class="flex flex-row items-stretch py-5">
				<div class="flex flex-col items-center" v-for="item in oauthApps">
					<a
						class="text-white no-underline border border-transparent py-2 px-4 flex flex-row justify-center items-center rounded-md mx-2"
						:style="{ 'background-color': LightenDarkenColor(item.color, canAddExtraAccount(item.name) ? -35 : 0) }"
						:class="{ disabled: canAddExtraAccount(item.name), 'text-red-500': canAddExtraAccount(item.name) }"
						:href="getURL(item.name)"
						target="_blank"
						rel="noopener noreferrer"
					>
						<font-awesome-icon :icon="[`fab`, `${item.name.toLowerCase()}`]" class="mr-2" />
						{{ item.name }}
					</a>
				</div>
			</div>
			<div class="flex items-center w-full">
				<div class="flex-grow bg bg-gray-300 h-0.5"></div>
				<div class="flex-grow-0 mx-5 text dark:text-white">or</div>
				<div class="flex-grow bg bg-gray-300 h-0.5"></div>
			</div>
			<button
				@click="logout"
				type="button"
				class="mt-5 inline-flex justify-center rounded-md border border-transparent shadow-sm px-5 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
			>
				<div class="flex flex-row justify-center items-center">
					<font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" class="mr-2" />
					<span>Logout</span>
				</div>
			</button>
		</div>
	</div>

	<span class="w-full flex items-center align-center" v-if="user.loading.userdata">
		<svg
			role="status"
			class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
			viewBox="0 0 100 101"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
				fill="currentColor"
			/>
			<path
				d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
				fill="currentFill"
			/>
		</svg>
	</span>
</template>
<script lang="ts">
import { getBaseURL } from "@/helpers/auto-refresh-tokens";
import { registerNewToken } from "@/helpers/webauthn";
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {
			oauthApps: [
				{
					name: "Discord",
					color: "#7289DA",
				},
				{
					name: "Twitch",
					color: "#6441a5",
				},
				{
					name: "Spotify",
					color: "#1ed760",
				},
				{
					name: "POS",
					color: "#2c3e50",
				},
			],
		};
	},
	setup() {
		return { user: useUserStore() };
	},
	methods: {
		registerNewToken,
		async logout() {
			this.user.logout();
		},
		change(event: Event) {
			console.log(event);
			if (this.user.user) {
				//@ts-ignore
				const string = event.target.id.split("-")?.[0];
				//@ts-ignore
				this.user.user.settings["show" + string.charAt(0).toUpperCase() + string.slice(1)] = event.target.checked;
			}
		},
		LightenDarkenColor(color: string, percent: number) {
			return (
				"#" +
				[1, 3, 5]
					.map((x) => {
						let temp = parseInt(color.substring(x, x + 2), 16);
						temp = ~~((temp * (100 + percent)) / 100);
						temp = Math.min(temp, 255);
						return temp.toString(16).padStart(2, "0");
					})
					.join("")
			);
		},
		getURL(name: string) {
			if (name == "POS") {
				return "https://chrome.google.com/webstore/detail/homeex/ghjlkdhcijpomopkolgnoejjkdbmhdci";
			}
			return `${getBaseURL()}/auth/${name.toLowerCase()}/login`;
		},
		canAddExtraAccount(name: string) {
			name = name.toLowerCase();
			if (name === "pos") {
				return !!this.user.user?.settings.widgetsAvailable.find((x) => x.name === "VIA");
			}
			return !true;
		},
	},
	mounted() {
		// loginWithWebAuth(true);
	},
});
</script>
