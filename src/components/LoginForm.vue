<template>
	<div class="min-h-full flex items-center justify-center pb-8 px-4 sm:px-6 lg:px-8">
		<div class="max-w-sm w-full">
			<passage-auth :app-id="passageAppID"></passage-auth>
		</div>
	</div>
</template>
<script lang="ts">
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";
import TurnstileComponent from "@/components/Turnstile.vue";

import "@passageidentity/passage-elements/passage-auth";

// TODO: Implement social logins right here and link with accounts
// Backend should have a pending user list?

export default defineComponent({
	setup() {
		return { login: useUserStore(), toast: useToast() };
	},
	mounted() {
		const self = this;
		const onSuccess = (authResult: {
			redirect_url: string;
			auth_token: string;
			refresh_token?: string; // only if you have refresh tokens enabled.
			refresh_token_expiration?: number; // only if you have refresh tokens enabled
		}) => {
			console.log("got here", authResult);
			self.login.passageLoginSuccess(authResult.auth_token);
		};
		const passageAuth = document.querySelector("passage-auth");
		//@ts-ignore
		passageAuth.onSuccess = onSuccess;
	},
	computed: {
		passageAppID() {
			return window.env.PASSAGE_APP_ID;
		},
	},
});
</script>

<style>
.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.v-enter-active {
	animation: bounce-in 0.5s;
	transition: opacity 0.4s ease;
}

.v-leave-active {
	animation: bounce-in 0.5s reverse;
	transition: opacity 0.4s ease;
}

@keyframes bounce-in {
	0% {
		transform: scale(0);
	}

	100% {
		transform: scale(1);
	}
}
</style>
