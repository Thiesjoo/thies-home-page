<template>
	<Modal :openOnMount="!!$route.query.open" @toggle="toggle">
		<template #button>
			<div class="rounded p-1">
				<span>{{ popupTitle }}</span>
			</div>
		</template>
		<template #title>
			{{ title }}
		</template>

		<template #content>
			<div class="min-w-[30vw]">
				<ProfilePage v-if="user.loggedIn" />
				<LoginForm v-else />
			</div>
		</template>
	</Modal>
</template>
<script lang="ts">
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "vue";
import LoginForm from "./LoginForm.vue";
import ProfilePage from "./ProfilePage.vue";
import Modal from "./Modal.vue";

export default defineComponent({
	computed: {
		title(): string {
			return this.user.loggedIn ? "Your profile" : "Login to your account";
		},
		popupTitle(): string {
			return this.user.loggedIn ? "Your profile" : "Login";
		},
	},
	methods: {
		toggle(state: boolean) {
			//@ts-ignore
			const recaptcha = this.$recaptchaInstance?.value;
			if (!recaptcha) return;

			if (!state) {
				recaptcha.hideBadge();
			} else if (!this.user.loggedIn && state) {
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
		this.user.$subscribe(async function (mut, state) {
			//@ts-ignore
			const recaptcha = self.$recaptchaInstance.value;

			if (state.loggedIn) {
				recaptcha.hideBadge();
			} else if (self.$route.query.open) {
				// Not logged in, but view is open
				recaptcha.showBadge();
			}
		});
	},
	components: { LoginForm, ProfilePage },
});
</script>
<style>
td {
	padding: 5px 15px;
}
</style>
