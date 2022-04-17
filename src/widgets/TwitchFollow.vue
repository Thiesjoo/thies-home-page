<template>
	<div class="relative" @mouseleave="open = false">
		<Base
			color="purple"
			:val="getFollows"
			@mouseover="open = true"
			link="https://twitch.tv/"
		>
			<font-awesome-icon :icon="['fab', 'twitch']" />
		</Base>
		<Transition
			enter-active-class="transition ease-out duration-200"
			enter-class="transform opacity-0 scale-95"
			enter-to-class="transform opacity-100 scale-100"
			leave-active-class="transition ease-in duration-175"
			leave-class="transform opacity-100 scale-100"
			leave-to-class="transform opacity-0 scale-95"
		>
			<div
				v-if="open"
				@mouseover="open = true"
				class="absolute flex flex-col items-center right-0 w-64 py-2 mt-2 e bg-gray-100 rounded-md shadow-xl"
			>
				<a
					:href="'https://twitch.tv/' + item.url"
					rel="nofollow"
					class="grow inline-flex w-full px-1 py-3 text-sm text-gray-700 hover:bg-gray-400 hover:text-white no-underline"
					v-for="item in data"
				>
					<div class="px-4 w-36 items-center align-top">
						<img
							:src="item.avatar"
							class="object-contain rounded-full w-full h-auto shadow-md"
						/>
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

<script>
import { defineComponent } from "@vue/runtime-core";
import Base from "@/widgets/Base.vue";

export default defineComponent({
	data() {
		return { open: false, data: [] };
	},
	methods: {
		async getFollows() {
			const fetchRes = await fetch("/api/external/twitchfollow", {
				credentials: "include",
			});
			if (!fetchRes.ok) throw new Error(fetchRes.statusText);

			const res = await fetchRes.json();
			this.data = res.data
				.map((x) => {
					return {
						name: x.user_name,
						url: x.user_login,
						title: x.title,
						game_name: x.game_name,
						avatar: x.profile_image_url,
						stream_image: x.thumbnail_url
							.replace("{width}", "1920")
							.replace("{height}", "1080"),
						viewers: x.viewer_count,
					};
				})
				.sort((a, b) => b.viewers - a.viewers);
			return `${res.data.length} streams`;
		},
	},
	components: { Base },
});
</script>
