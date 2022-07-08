<!-- What this file should implement:

Check if a user is logged in and display information about:

Profile information (From modal)
Linked providers



-->
<!-- TODO: Implement listing of all providers here -->
<!-- <a
	class="text-red-500 no-underline pt-2 flex flex-row justify-center items-center"
	target="_blank"
	rel="noopener noreferrer"
  :href="getDeleteURL(item.name)"
	v-if="canUnlink(item.name)"
>
						<font-awesome-icon :icon="[`fas`, `link-slash`]" size="sm" class="mr-2" /> unlink</a> -->

<!-- getDeleteURL(name: string, id: string) {
			if (name == "POS") {
				return "https://chrome.google.com/webstore/detail/homeex/ghjlkdhcijpomopkolgnoejjkdbmhdci";
			}
			return `${getBaseURL()}/api/providers/me/${name.toLowerCase()}/${id}`;
		}, -->

<template>
	<div></div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {};
	},
	async mounted() {
		axios.get("/api/");
	},
});
</script>
