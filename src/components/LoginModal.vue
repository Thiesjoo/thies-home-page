<template>
	<div>
		<div class="rounded p-1" @click="toggle">
			<span>{{ popupTitle }}</span>
		</div>
		<div>
			<!-- MODAL -->
			<div
				class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full flex justify-center items-center"
				v-if="open"
				v-click-outside="toggle"
			>
				<div class="relative p-4 w-full max-w-2xl h-full md:h-auto z-100">
					<div class="relative rounded-lg shadow bg-gray-700">
						<div
							class="flex justify-between items-start p-5 rounded-t border-b border-gray-600"
						>
							<h2 class="mt-6 text-center w-full text-3xl font-extrabold">
								{{ title }}
							</h2>
							<button
								type="button"
								@click="toggle"
								class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
							>
								<font-awesome-icon :icon="['fas', 'xmark']" size="lg" />
							</button>
						</div>
						<div
							class="pt-1 p-6 space-y-6 text-base leading-relaxed text-gray-400"
						>
							<ProfilePage v-if="authed" />
							<LoginForm v-else />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { windowEvent } from "@/helpers/constants";
import { defineComponent } from "vue";
import LoginForm from "./LoginForm.vue";
import ProfilePage from "./ProfilePage.vue";

function listener() {
	//@ts-ignore
	this.authed = window.networking.authenticated;
}

export default defineComponent({
	data(): {
		open: boolean;
		authed: boolean;
	} {
		return {
			open: false,
			authed: window.networking.authenticated,
		};
	},
	computed: {
		title() {
			//@ts-ignore
			return this.authed ? "Your profile" : "Login to your account";
		},
		popupTitle() {
			//@ts-ignore
			return this.authed ? "Your profile" : "Login";
		},
	},
	methods: {
		toggle() {
			this.open = !this.open;
			if (!this.authed) {
				//@ts-ignore
				const recaptcha = this.$recaptchaInstance.value;
				if (this.open) {
					recaptcha.showBadge();
				} else {
					recaptcha.hideBadge();
				}
			}
		},
	},
	async created() {
		await this.$recaptchaLoaded();
		//@ts-ignore
		this.$recaptchaInstance.value.hideBadge();
		window.addEventListener(windowEvent, listener.bind(this));
	},
	mounted() {
		if (this.$route.query.open) {
			this.open = true;
		}
	},
	beforeDestroy() {
		window.removeEventListener(windowEvent, listener.bind(this));
	},
	components: { LoginForm, ProfilePage },
});
</script>
<style>
td {
	padding: 5px 15px;
}
</style>
