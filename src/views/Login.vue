<template>
	<div class="h-[100vh] flex items-center justify-center pb-8 px-4 sm:px-6 lg:px-8">
		<h2 v-if="user.loggedIn">Redirecting you to the original website in a couple of seconds</h2>
		<div v-if="!user.loggedIn" class="max-w-sm w-full rounded-md shadow-sm -space-y-px bg-gray-700 text-white">
			<h2 class="mt-6 mb-6 text-center w-full text-3xl font-extrabold">Please authenticate</h2>
			<LoginForm> </LoginForm>
		</div>
	</div>
</template>

<script lang="ts">
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "vue";
import LoginForm from "@/components/LoginForm.vue";

function processState(state: any) {
	// Next state mutation will toggle loading
	if (state.loggedIn && !state.isLoading) {
		let params = new URL(window.location.href).searchParams;
		let name = params.get("next");
		window.location.href = decodeURIComponent(name || "/home");
	}
}

export default defineComponent({
	setup() {
		const user = useUserStore();
		user.$subscribe((mutation, state) => processState(state));

		return { user };
	},
	methods: {},
	mounted() {
		processState(this.user);
	},
	components: { LoginForm },
});
</script>
