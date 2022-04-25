<template>
	<div
		class="min-h-full flex items-center justify-center pb-8 px-4 sm:px-6 lg:px-8"
	>
		<div class="max-w-sm w-full">
			<form class="space-y-6" @submit="onSubmit">
				<input type="hidden" name="remember" value="true" />
				<div class="rounded-md shadow-sm -space-y-px">
					<div>
						<label for="email-address" class="sr-only">Email address</label>
						<input
							v-model="email"
							type="email"
							autocomplete="email"
							required
							autofocus
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Email address"
						/>
					</div>
					<div>
						<label for="password" class="sr-only">Password</label>
						<input
							v-model="password"
							type="password"
							autocomplete="current-password"
							required
							pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,64}$"
							title="Password should be at least 8 letters, contain a number, small letter and capital letter"
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Password"
						/>
					</div>
				</div>
				<div class="w-full m-0 items-center flex">
					<span
						class="text-rose-600 text-center font-semibold w-full text-xl"
						v-if="error"
						>{{ error }}</span
					>
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

<script lang="ts">
import { getBaseURL } from "@/helpers/auto-refresh-tokens";
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {
			email: "",
			password: "",
			error: "",
		};
	},
	methods: {
		async onSubmit(e: Event) {
			e.preventDefault();
			if (!this.email || !this.password) {
				return;
			}
			try {
				const fetchRes = await fetch(getBaseURL() + "/auth/local/login", {
					method: "POST",
					body: JSON.stringify({
						email: this.email,
						password: this.password,
					}),
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});
				const json = await fetchRes.json();
				if (!json.access) {
					this.error = json.message || json.error;
				} else {
					alert("Logged in!!");
					window.location.reload();
				}
			} catch (e: any) {
				this.error = e?.message || e?.error;
			}
		},
	},
});
</script>
