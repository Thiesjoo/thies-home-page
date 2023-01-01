<template>
	<Modal :openOnMount="!!$route.query.open">
		<template #button>
			<div class="rounded p-1">
				<span>{{ popupTitle }}</span>
			</div>
		</template>
		<template #title>
			{{ title }}
		</template>

		<template #content>
			<div class="min-w-[40vw]">
				<ProfilePage v-if="user.loggedIn" />
				<LoginForm v-else />
			</div>
		</template>
	</Modal>
</template>
<script lang="ts">
import { useUserStore } from "@/store/user.store";
import { defineAsyncComponent, defineComponent } from "vue";
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
	setup() {
		const userStore = useUserStore();

		return { user: userStore };
	},
	components: {
		LoginForm: defineAsyncComponent(() => import("./LoginForm.vue")),
		ProfilePage: defineAsyncComponent(() => import("./ProfilePage.vue")),
		Modal,
	},
});
</script>
<style>
td {
	padding: 5px 15px;
}
</style>
