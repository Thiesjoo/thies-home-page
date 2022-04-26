<template>
	<div
		class="min-h-full flex items-center justify-center pb-8 px-4 sm:px-6 lg:px-8"
	>
		<div class="max-w-sm w-full">
			<div class="w-full m-0 mb-3 items-center flex">
				<span
					class="text-rose-600 text-center font-semibold w-full text-xl"
					v-if="error"
					>{{ error }}</span
				>
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
								placeholder="Your full name"
							/></div
					></Transition>
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
							placeholder="Email address"
						/>
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
							placeholder="Password"
						/>
					</div>
					<Transition>
						<div v-if="!renderLogin">
							<label for="password" class="sr-only"
								>Password confirmation</label
							>
							<input
								v-model="passwordConfirm"
								type="password"
								autocomplete="new-password"
								required
								pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,64}$"
								title="Password should be at least 8 letters, contain a number, small letter and capital letter"
								class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Confirmation password"
							/></div
					></Transition>
				</div>

				<div class="flex items-center justify-between">
					<div class="text-sm">
						<a
							@click="renderLogin = !renderLogin"
							class="font-medium text-gray-100 hover:text-gray-400"
						>
							{{
								renderLogin
									? "Register new account"
									: "Login to existing account"
							}}
						</a>
					</div>
					<div class="text-sm">
						<a
							href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
							style="text-decoration: none"
							v-if="renderLogin"
							class="font-medium text-gray-100 hover:text-gray-400"
						>
							Forgot your password?
						</a>
					</div>
				</div>

				<div>
					<button
						type="submit"
						class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<span class="absolute left-0 inset-y-0 flex items-center pl-3">
							<font-awesome-icon :icon="['fas', 'lock']" size="lg" />
						</span>
						Log in
					</button>
				</div>
			</form>
		</div>
	</div>
</template>
<!-- TODO: Add recaptcha -->
<script lang="ts">
import { getBaseURL } from "@/helpers/auto-refresh-tokens";
import { defineComponent } from "vue";

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
		};
	},
	methods: {
		async onSubmit(e: Event) {
			e.preventDefault();
			if (
				!this.email ||
				!this.password ||
				(!this.renderLogin && !this.passwordConfirm) ||
				(!this.renderLogin && !this.name)
			) {
				return;
			}

			if (!this.renderLogin && this.password !== this.passwordConfirm) {
				this.error = "Password and password confirmation should be the same";
				return;
			}

			await this.$recaptchaLoaded();
			const body: { email: string; password: string; name?: string } = {
				email: this.email,
				password: this.password,
			};

			if (!this.renderLogin) {
				body.name = this.name;
			}

			try {
				const recaptchaToken = await this.$recaptcha(
					!this.renderLogin ? "Register" : "Login"
				);

				const fetchRes = await fetch(
					getBaseURL() +
						"/auth/local/" +
						(!this.renderLogin ? "register" : "login"),
					{
						method: "POST",
						body: JSON.stringify(body),
						headers: {
							"Content-Type": "application/json",
							recaptcha: recaptchaToken,
						},
						credentials: "include",
					}
				);
				const json = await fetchRes.json();
				if (!json.access) {
					//TODO: Parse the error array from here
					this.error = json.message || json.error;
				} else {
					//TODO: Inform user of success
					window.location.reload();
				}
			} catch (e: any) {
				this.error = e?.message || e?.error;
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
