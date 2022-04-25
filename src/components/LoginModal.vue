<template>
	<div>
		<div class="rounded p-1" @click="toggle">
			<span>Login!</span>
		</div>
		<div>
			<!-- MODAL -->
			<div
				class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full flex justify-center items-center"
				v-if="open"
				v-click-outside="toggle"
			>
				<div class="relative p-4 w-full max-w-2xl h-full md:h-auto z-100">
					<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
						<div
							class="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600"
						>
							<h2 class="mt-6 text-center w-full text-3xl font-extrabold">
								{{ title }}
							</h2>
							<button
								type="button"
								@click="toggle"
								class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
							>
								<font-awesome-icon :icon="['fas', 'xmark']" size="lg" />
							</button>
						</div>
						<div
							class="pt-1 p-6 space-y-6 text-base leading-relaxed text-gray-500 dark:text-gray-400"
						>
							<LoginForm />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LoginForm from "./LoginForm.vue";

export default defineComponent({
	data() {
		return {
			open: false,
		};
	},
	computed: {
		title() {
			return window.networking.authenticated
				? "Your profile"
				: "Login to your account";
		},
	},
	methods: {
		toggle() {
			this.open = !this.open;
		},
	},
	mounted() {
		if (this.$route.query.open) {
			this.open = true;
		}
	},
	components: { LoginForm },
});
</script>
<style>
td {
	padding: 5px 15px;
}
</style>
