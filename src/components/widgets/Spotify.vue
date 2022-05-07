<template>
	<Base color="blue" :val="text" link="https://open.spotify.com/"
		>Hier moet eigenlijk moker lange tekst</Base
	>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { Base } from "./";

export default defineComponent({
	data() {
		return {
			text: "Hoi",
		};
	},
	async created() {
		const fetchRes = await fetch("/api/external/spotify");
		const res = await fetchRes.json();
		console.log("SPOTIFY: ", res);
		return "boe";
	},
	components: { Base },
});
</script>
