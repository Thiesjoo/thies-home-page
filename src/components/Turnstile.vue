<!-- Part of the code form https://github.com/Astrian/cfturnstile-vue3/blob/main/src/TurnstileComponent.vue -->
<!-- Definitions for typescript are in "envParser.ts" -->
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
	name: "TurnstileComponent",
	data: () => ({
		current: "",
		showPlaceholder: true,
	}),
	props: {
		sitekey: {
			type: String,
			required: true,
		},
		action: {
			type: String,
			required: true,
		},
	},
	emits: {
		verifyLogin: (response: string) => {
			if (response !== null && response !== "") return true;
			else return false;
		},
		verifyWebauth: (response: string) => {
			if (response !== null && response !== "") return true;
			else return false;
		},
		expire: null,
		fail: null,
	},
	methods: {
		renderTurnstile() {
			this.current =
				window.turnstile?.render("#turnstile-box", {
					sitekey: this.sitekey,
					action: this.action,
					callback: (response: string) =>
						//@ts-ignore Vue doesn't like function names based on strings
						this.$emit(this.action === "login" ? "verifyLogin" : "verifyWebauth", response),
					"expired-callback": this.$emit("expire"),
					"error-callback": this.$emit("fail"),
				}) || "";
		},
		leave() {
			this.showPlaceholder = true;
		},
	},
	watch: {
		action: function () {
			if (this.action && window.turnstile) {
				this.showPlaceholder = false;
				if (this.action === "hide") {
					this.current = "";
					return;
				}

				if (window.env.VUE_APP_VERCEL_ENV === "development") {
					// @ts-ignore
					this.$emit(this.action === "login" ? "verifyLogin" : "verifyWebauth", "dev-key");
				} else {
					this.renderTurnstile();
				}
			}
		},
	},
	setup() {
		onMounted(() => {
			if (window.turnstile === null || !window.turnstile) {
				const script = document.createElement("script");
				script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
				script.async = true;
				script.defer = true;
				document.head.appendChild(script);
			}
		});
		window.onloadTurnstileCallback = () => {
			console.log("Turnstile loaded");
		};
	},
});
</script>

<template>
	<Transition @after-leave="leave">
		<div ref="turnstileBox" id="turnstile-box" v-show="current" style="height: 65px; margin-top: 5px"></div>
	</Transition>
	<!-- Hardcoded values of the cloudflare box -->
	<!-- <div style="height: 70px; width: 300px" v-if="showPlaceholder"></div> -->
</template>
