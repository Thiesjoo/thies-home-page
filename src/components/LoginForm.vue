<template>
	<div class="min-h-full flex items-center justify-center pb-8 px-4 sm:px-6 lg:px-8">
		<div class="max-w-sm w-full">
			<div class="w-full m-0 mb-3 items-center flex">
				<span class="text-rose-600 text-center font-semibold w-full text-xl" v-if="error">{{ error }}</span>
			</div>
			<form class="space-y-6" @submit="onSubmit">
				<div class="rounded-md shadow-sm -space-y-px">
					<Transition>
						<div v-if="!renderLogin">
							<label for="name" class="sr-only">Full name</label>
							<input
								v-model="name"
								type="text"
								autocomplete="name"
								required
								min="3"
								title="Name should have at least 3 letters"
								class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Your full name" />
						</div>
					</Transition>

					<div>
						<label for="email-address" class="sr-only">Email address</label>
						<input
							v-model="email"
							type="email"
							autocomplete="email"
							required
							autofocus
							:class="{ 'rounded-t-md': renderLogin }"
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Email address" />
					</div>
					<div>
						<label for="password" class="sr-only">Password</label>
						<input
							v-model="password"
							type="password"
							:autocomplete="renderLogin ? 'current-password' : 'new-password'"
							required
							pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,64}$"
							title="Password should be at least 8 letters, contain a number, small letter and capital letter"
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							:class="{ 'rounded-b-md': renderLogin }"
							placeholder="Password" />
					</div>
					<div v-if="!renderLogin">
						<label for="password" class="sr-only">Password confirmation</label>
						<input
							v-model="passwordConfirm"
							type="password"
							autocomplete="new-password"
							required
							pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,64}$"
							title="Password should be at least 8 letters, contain a number, small letter and capital letter"
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Confirmation password" />
					</div>
					<Transition>
						<div v-if="renderLogin && showWebauth">
							<div class="relative flex pt-5 pb-2 items-center w-full">
								<div class="flex-grow border-t border-gray-400 border-solid"></div>
								<span class="flex-shrink mx-4 text-gray-400">Or use your fingerprint</span>
								<div class="flex-grow border-t border-gray-400 border-solid"></div>
							</div>
							<div class="w-full flex justify-center mt-5">
								<div
									class="bg-fuchsia-800 rounded-full w-10 h-10 flex justify-center items-center text-center"
									:class="{
										'opacity-40': webauthnPending,
									}"
									@click="onWebauth">
									<font-awesome-icon
										:icon="['fas', 'fingerprint']"
										size="xl"
										class="mx-auto"></font-awesome-icon>
								</div>
							</div>
						</div>
					</Transition>
				</div>

				<div class="flex items-center justify-between">
					<div class="text-sm">
						<a @click="renderLogin = !renderLogin" class="font-medium text-gray-100 hover:text-gray-400">
							{{ renderLogin ? "Register new account" : "Login to existing account" }}
						</a>
					</div>
					<div class="text-sm">
						<a
							href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
							style="text-decoration: none"
							v-if="renderLogin"
							class="font-medium text-gray-100 hover:text-gray-400">
							Forgot your password?
						</a>
					</div>
				</div>

				<div>
					<button
						type="submit"
						:disabled="login.loading.form"
						class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:hover:bg-indigo-600">
						<span class="absolute left-0 inset-y-0 flex items-center pl-3">
							<font-awesome-icon :icon="['fas', 'lock']" size="lg" v-if="!login.loading.form" />
							<svg
								v-if="login.loading.form"
								role="status"
								class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor" />
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill" />
							</svg>
						</span>
						Log in
					</button>
				</div>
			</form>
		</div>
	</div>
</template>
<script lang="ts">
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";

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
		};
	},
	setup() {
		return { login: useUserStore(), toast: useToast() };
	},
	computed: {
		showWebauth() {
			return !((this.email.length > 0 || this.password.length > 0) && !this.webauthnPending);
		},
	},
	methods: {
		async onWebauth() {
			this.webauthnPending = true;
			this.error = "";
			await this.$recaptchaLoaded();

			try {
				this.login.loginWithWebauth();
			} catch (e: any) {
				this.error = e?.message;
			}
			this.webauthnPending = false;
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

			await this.$recaptchaLoaded();

			try {
				const body = {
					email: this.email,
					password: this.password,
					recaptchaToken: await this.$recaptcha(!this.renderLogin ? "Register" : "Login"),
				};

				if (!this.renderLogin) {
					//Signup form
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
			} catch (e) {
				console.error("Recaptcha failed!");
				this.error = "Something went wrong with the recaptcha";
			}
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
