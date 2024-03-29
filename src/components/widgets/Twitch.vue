<!-- TODO: The lists automatically hides when hovering over the 6th streamer or so (On second monitor)
This is because the floating widget area start there. Increasing the z index doesn't help.
-->
<template>
	<div class="relative" @mouseleave="open = false">
		<Base color="purple" :loaded="loaded" @mouseover="open = true" link="https://twitch.tv/" v-bind="$attrs">
			<template #short> <font-awesome-icon :icon="['fab', 'twitch']" /></template>
			<template #content>{{ text }}</template>
		</Base>
		<Transition
			enter-active-class="transition ease-out duration-200"
			enter-class="transform opacity-0 scale-95"
			enter-to-class="transform opacity-100 scale-100"
			leave-active-class="transition ease-in duration-175"
			leave-class="transform opacity-100 scale-100"
			leave-to-class="transform opacity-0 scale-95">
			<div
				v-if="open"
				@mouseover="open = true"
				:class="{
					'bottom-0': $attrs.bottom,
					'mb-16': $attrs.bottom,
					'right-0': $attrs.right,
				}"
				class="absolute flex flex-col items-center w-64 py-2 mt-2 rounded-md shadow-xl"
				style="background-color: #222222">
				<a
					:href="'https://twitch.tv/' + item.url"
					rel="nofollow"
					target="_parent"
					class="grow inline-flex w-full px-1 py-3 text-sm text-gray-700 hover:bg-gray-400 hover:text-white no-underline"
					v-for="item in data">
					<div class="px-4 w-36 items-center align-top">
						<img :src="item.avatar" class="object-contain rounded-full w-full h-auto shadow-md" />
					</div>

					<div class="flex flex-col w-full break-words" :title="item.title">
						<b class="font-bold">{{ item.name }}</b>
						<i>{{ item.game_name }}</i>
						<div class="inline-flex items-center">
							<div class="w-3 h-3 rounded-full bg-red-600"></div>
							<div class="ml-1">{{ item.viewers }}</div>
						</div>
					</div>
				</a>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import axios from "axios";
import { Base } from ".";

export default defineComponent({
	props: {
		sample: { type: Boolean },
	},
	data(): {
		open: boolean;
		data: {
			name: string;
			url: string;
			title: string;
			game_name: string;
			avatar: string;
			stream_image: string;
			viewers: number;
		}[];
		text: string;
		loaded: boolean;
	} {
		return { open: false, data: [], text: "", loaded: true };
	},
	async created() {
		if (this.sample) {
			this.data = [
				{
					name: "GuanTheThird",
					url: "guanthethird",
					title: "Sample stream",
					game_name: "Just Chatting",
					avatar: "https://via.placeholder.com/150",
					stream_image: "".replace("{width}", "1920").replace("{height}", "1080"),
					viewers: 10000,
				},
			];
			this.text = "1 stream";

			return;
		}
		this.text = "... streams";

		this.text = await this.getFollows();
	},
	methods: {
		async getFollows() {
			const fetchRes = await axios.get("/api/external/twitchfollow", {
				baseURL: "/",
			});

			const res = fetchRes.data;
			this.data = res.data.map((x: any) => {
				return {
					name: x.user_name,
					url: x.user_login,
					title: x.title,
					game_name: x.game_name,
					avatar: x.profile_image_url,
					stream_image: x.thumbnail_url.replace("{width}", "1920").replace("{height}", "1080"),
					viewers: x.viewer_count,
				};
			});
			this.data.sort((a, b) => b.viewers - a.viewers);

			return `${res.data.length} stream${res.data.length == 1 ? "" : "s"}`;
		},
	},
	components: { Base },
});
</script>
