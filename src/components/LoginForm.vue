<template>
	<div class="min-h-full flex items-center justify-center pb-8 px-4 sm:px-6 lg:px-8">
		<div class="max-w-sm w-full">Please wait, opening the popup dialog!</div>
	</div>
</template>
<script lang="ts">
import { useUserStore } from "@/store/user.store";
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";

import auth from "@/auth";

export default defineComponent({
	setup() {
		return { login: useUserStore(), toast: useToast() };
	},
	mounted() {
		auth.startAuthentication();
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
