<template>
	<Base :loaded="loaded">
		<template #content>
			<div class="flex flex-row w-[300px] text-center">
				<div class="items-center flex">
					<img :src="imageURL" class="h-12 rounded-full" />
				</div>
				<div class="w-full flex flex-col">
					<span
						class="font-bold m-1 w-75 text-center text-ellipsis"
						style="overflow: hidden; white-space: pre-line"
						>{{ nameArtist }}</span
					>
					<!-- <div class="m-1">buttons</div> -->
					<div class="w-[85%] m-auto flex flex-row items-center">
						{{ current }}
						<div class="w-full rounded-full h-2.5 bg-gray-600 mx-2">
							<div
								class="bg-green-200 h-2.5 rounded-full"
								style="transition: all 0.4s linear"
								:style="{ width: `${percentage}%` }"
							></div>
						</div>
						{{ end }}
					</div>
				</div>
			</div>
		</template>
	</Base>
</template>

<script lang="ts">
import { CurrentlyPlaying, Track } from "@/helpers/types/spotify.api";
import { defineComponent } from "@vue/runtime-core";
import { Base } from "./";
import errorCaptured from "./errorCaptured";

const spotifyRefreshTimer = 1500;

function secondsToTimeString(secs: number) {
	const divisor_for_minutes = secs % (60 * 60);
	const minutes = Math.floor(divisor_for_minutes / 60);

	const divisor_for_seconds = divisor_for_minutes % 60;
	const seconds = Math.ceil(divisor_for_seconds);

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default defineComponent({
	data(): {
		//Because track is an object, we need a refreshKey for vue to detect changes
		track?: CurrentlyPlaying;
		refreshKey: boolean;
		loaded: boolean;
		spotifyAccesstoken?: string;
		interval?: number;
	} {
		return {
			loaded: false,
			refreshKey: false,
		};
	},
	computed: {
		current(): string {
			this.refreshKey;
			return this.track
				? secondsToTimeString((this.track.progress_ms || 0) / 1000)
				: "0:00";
		},
		end(): string {
			this.refreshKey;
			return this.track
				? secondsToTimeString((this.track.item?.duration_ms || 0) / 1000)
				: "0:00";
		},
		percentage(): number {
			this.refreshKey;

			return this.track
				? ((this.track.progress_ms || 0) /
						(this.track.item?.duration_ms || 0)) *
						100
				: 0;
		},
		imageURL(): string {
			this.refreshKey;

			return (this.track?.item as Track).album.images[0].url;
		},
		nameArtist(): string {
			this.refreshKey;

			return this.track ? `${this.track.item?.name}` : "Not currently playing";
		},
	},
	methods: {
		async refreshTrack() {
			if (!this.spotifyAccesstoken) return;

			const spotifyFetch = await fetch("https://api.spotify.com/v1/me/player", {
				headers: {
					Authorization: "Bearer " + this.spotifyAccesstoken,
					"Content-Type": "application/json",
				},
			});
			const spotifyResult = await spotifyFetch.json();
			if (spotifyResult.error) {
				clearInterval(this.interval);
				throw new Error(spotifyResult);
			}

			this.track = spotifyResult as CurrentlyPlaying;
			this.refreshKey = !this.refreshKey;
		},
	},
	async mounted() {
		const fetchRes = await fetch("/api/external/spotify");
		const res = await fetchRes.json();

		if (!res?.data?.accesstoken) {
			throw new Error("Coulnd't fetch spotify credentials");
		}
		this.spotifyAccesstoken = res.data.accesstoken;

		const self = this;
		this.interval = setInterval(function () {
			self.refreshTrack();
		}, spotifyRefreshTimer);

		await this.refreshTrack();
		this.loaded = true;
	},
	beforeDestroy() {
		if (this.interval) clearInterval(this.interval);
	},
	errorCaptured,
	components: { Base },
});
</script>
