<template>
	<div class="min-h-full flex items-center justify-center pb-8 px-4 sm:px-6 lg:px-8">
		<div class="max-w-sm w-full">
			<passage-auth app-id="wdOiIQrP7mIDfV5wJwE1tco5"></passage-auth>
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
	props: {
		login: {
			default: true,
			type: Boolean,
		},
	},
	data() {
		return {
			email: "",
			password: "",
			passwordConfirm: "",
			name: "",
			error: "",
			renderLogin: this.login,
			webauthnPending: false,
			recaptchaAction: "",
		};
	},
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
			// localStorage.setItem("psg_auth_token", authResult.auth_token);
			// window.location.href = authResult.redirect_url;
		};
		const passageAuth = document.querySelector("passage-auth");
		//@ts-ignore
		passageAuth.onSuccess = onSuccess;
	},
	computed: {
		showWebauth() {
			return !((this.email.length > 0 || this.password.length > 0) && !this.webauthnPending);
		},
		allowInput() {
			return this.login.loading.form;
		},
	},
	methods: {
		async onError(error: any) {
			if (error) {
				console.error("Error from turnstile", error);
				this.error = error?.message;
				this.webauthnPending = false;
				this.recaptchaAction = "";
			}
		},
		async onValidLoginToken(recaptchaToken: string) {
			const body = {
				email: this.email,
				password: this.password,
				recaptchaToken,
			};

			if (!this.renderLogin) {
				// Signup form
				try {
					await this.login.register({
						...body,
						name: this.name,
					});
				} catch (e: any) {
					this.error = e?.message;
				}

				return;
			}

			try {
				await this.login.login(body);
			} catch (e: any) {
				this.error = e;
			}
			this.recaptchaAction = "hide";
		},
		async onValidWebauthToken(recaptchaToken: string) {
			try {
				this.login.loginWithWebauth(recaptchaToken);
			} catch (e: any) {
				this.error = e?.message;
			}

			this.webauthnPending = false;
			this.recaptchaAction = "hide";
		},
		async onWebauth() {
			this.webauthnPending = true;
			this.error = "";

			this.recaptchaAction = "webauth";
		},
		async onSubmit(e: Event) {
			e.preventDefault();
			if (!this.email || !this.password || (!this.renderLogin && (!this.passwordConfirm || !this.name))) {
				return;
			}
			if (!this.renderLogin && this.password !== this.passwordConfirm) {
				this.error = "Password and password confirmation should be the same";
				return;
			}

			this.error = "";
			this.recaptchaAction = "login";
		},
	},
	components: {
		TurnstileComponent,
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
