<template>Please wait, redirecting you to the dashboard!</template>
<script lang="ts">
import { defineComponent } from "vue";

import { callback } from "@/auth/oidc";

export default defineComponent({
	mounted() {
		callback();
	},
});
</script>
