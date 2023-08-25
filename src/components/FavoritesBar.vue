<template>
	<div
		class="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-[8vh] rounded-full m-2 p-2 pr-5 pl-5 flex flex-row space-x-2">
		<div
			v-for="favorite in user.favorites"
			@click="navigate(favorite.url)"
			class="flex flex-col justify-center items-center rounded-full w-24 h-24 hover:bg-slate-300/50">
			<img :src="getFavoiconForSite(favorite.url)" class="w-8 h-8" />
			<span class="font-bold pt-2"> {{ favorite.name }}</span>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { lightenDarkenColor } from "@/helpers/colors";
import { useUserStore } from "@/store/user.store";

export default defineComponent({
	setup() {
		const store = useUserStore();
		return { user: store };
	},
	methods: {
		navigate(url: string) {
			(window.top || window.parent || window).location.href = url;
		},
		getFavoiconForSite(url: string) {
			try {
				const favicon = new URL(url).origin + "/favicon.ico";
				return favicon;
			} catch (e) {
				return "https://www.google.com/s2/favicons?sz=64&domain_url=" + url;
			}
		},
		lightenDarkenColor,
	},
});
</script>
