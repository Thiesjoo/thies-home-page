<template>
	<div>
		<div class="rounded p-1" @click="toggle">
			<span>{{ popupTitle }}</span>
		</div>
		<div>
			<!-- MODAL -->
			<!-- FIXME: Modal should be ported to a class, because the changes here do not affect other modals -->
			<div
				class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-100 w-[100vw] md:inset-0 h-modal h-[100vh] flex justify-center items-center"
				v-if="open"
				v-click-outside="toggle">
				<div class="relative p-4 w-full max-w-2xl h-auto">
					<div class="relative rounded-lg shadow bg-gray-700">
						<div class="flex justify-between items-start p-5 rounded-t border-b border-gray-600">
							<h2 class="mt-6 text-center w-full text-3xl font-extrabold">
								{{ title }}
							</h2>
							<!-- FIXME: The text is not centered, because button is not in the correct place -->
							<button
								type="button"
								@click="toggle"
								class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white">
								<font-awesome-icon :icon="['fas', 'xmark']" size="lg" />
							</button>
						</div>
						<div class="pt-1 p-6 space-y-6 text-base leading-relaxed text-gray-400">
							<ProfilePage v-if="user.loggedIn" />
							<LoginForm v-else />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "vue";
import LoginForm from "./LoginForm.vue";
import ProfilePage from "./ProfilePage.vue";

export default defineComponent({
	data(): {
		open: boolean;
	} {
		return {
			open: false,
		};
	},
	computed: {
		title(): string {
			return this.user.loggedIn ? "Your profile" : "Login to your account";
		},
		popupTitle(): string {
			return this.user.loggedIn ? "Your profile" : "Login";
		},
	},
	methods: {
		toggle() {
			this.open = !this.open;
			//@ts-ignore
			const recaptcha = this.$recaptchaInstance.value;

			if (!this.open) {
				recaptcha.hideBadge();
			}

			if (!this.user.loggedIn && this.open) {
				recaptcha.showBadge();
			}
		},
	},
	setup() {
		const userStore = useUserStore();

		return { user: userStore };
	},
	async created() {
		await this.$recaptchaLoaded();
		//@ts-ignore
		this.$recaptchaInstance.value.hideBadge();

		const self = this;
		this.user.$subscribe(function (mut, state) {
			//@ts-ignore
			const recaptcha = self.$recaptchaInstance.value;

			if (state.loggedIn) {
				recaptcha.hideBadge();
			} else if (self.open) {
				// Not logged in, but view is open
				recaptcha.showBadge();
			}
		});
	},
	mounted() {
		if (this.$route.query.open) {
			this.open = true;
		}
	},
	components: { LoginForm, ProfilePage },
});
</script>
<style>
td {
	padding: 5px 15px;
}
</style>
