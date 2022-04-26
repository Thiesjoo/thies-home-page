<template>
	hehe hoi!
	<button
		@click="logout"
		type="button"
		class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
	>
		<font-awesome-icon :icon="['fas', 'fa-arrow-right-from-bracket']" />
		Logout
	</button>
</template>
<script lang="ts">
import { getBaseURL } from "@/helpers/auto-refresh-tokens";
import { defineComponent } from "vue";
export default defineComponent({
	data() {
		return {};
	},
	methods: {
		async logout() {
			try {
				await fetch(getBaseURL() + "/auth/refresh/logout", {
					method: "GET",
					credentials: "include",
				});
				window.location.reload();
			} catch (e: any) {
				console.error(e);
				alert(e);
			}
		},
	},
});
</script>
