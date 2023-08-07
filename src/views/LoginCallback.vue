<template>Please wait, redirecting you to the dashboard!</template>
<script lang="ts">
import { defineComponent } from "vue";

import { callback } from "@/helpers/oidc";
import "@passageidentity/passage-elements/passage-auth";

export default defineComponent({
	mounted() {
		callback();
	},
});
</script>
