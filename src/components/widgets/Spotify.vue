<template>
	<Base :loaded="loaded">
		<template #content>
			<div class="flex flex-row w-[300px] text-center" v-if="renderTrack">
				<div class="items-center flex">
					<img :src="imageURL" class="h-12 rounded-full" />
				</div>
				<div class="w-full flex flex-col">
					<span class="font-bold m-1 w-75 text-center text-ellipsis" style="overflow: hidden; white-space: pre-line">{{
						nameArtist
					}}</span>
					<!-- <div class="m-1">buttons</div> -->
					<div class="w-[85%] m-auto flex flex-row items-center">
						{{ current }}
						<div class="w-full rounded-full h-2.5 bg-gray-600 mx-2">
							<div class="bg-green-200 h-2.5 rounded-full" :style="{ width: `${percentage}%` }"></div>
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

/** How often to ping spotify for music change */
const spotifyRefreshTimer = 5000;
/** How often to increase our own timer of the progress bar */
const smoothProgressBar = 100;

/**
 * Make a M:ss string from the amount of seconds
 */
function secondsToTimeString(secs: number | null): string {
	if (!secs) {
		return "0:00";
	}
	const minutes = Math.floor((secs % 3600) / 60);
	const seconds = Math.floor(secs % 60)
		.toString()
		.padStart(2, "0");

	return `${minutes}:${seconds}`;
}

export default defineComponent({
	data(): {
		//Because track is an object, we need a refreshKey for vue to detect changes
		track?: CurrentlyPlaying;
		pendingRequest: boolean;
		refreshKey: boolean;
		loaded: boolean;
		spotifyAccesstoken?: string;
		interval?: number;
		interval2?: number;
	} {
		return {
			track: undefined,
			loaded: false,
			refreshKey: false,
			pendingRequest: false,
		};
	},
	computed: {
		renderTrack(): boolean {
			this.refreshKey;

			return !!this?.track;
		},
		current(): string {
			this.refreshKey;

			return secondsToTimeString((this.track?.progress_ms || 0) / 1000);
		},
		end(): string {
			this.refreshKey;
			return secondsToTimeString((this.track?.item?.duration_ms || 0) / 1000);
		},
		percentage(): number {
			this.refreshKey;

			return this.track ? Math.round(((this.track.progress_ms || 0) / (this.track.item?.duration_ms || 0)) * 100) : 0;
		},
		imageURL(): string {
			this.refreshKey;

			return (this.track?.item as Track).album.images[0].url;
		},
		nameArtist(): string {
			this.refreshKey;

			return this.track
				? `${this.track.item?.name} - ${(this.track.item as Track).artists.map((x) => x.name).join(", ")}`
				: "Not currently playing";
		},
	},
	methods: {
		async refreshTrack() {
			if (!this.spotifyAccesstoken || this.pendingRequest) return;
			this.pendingRequest = true;
			try {
				const spotifyFetch = await fetch("https://api.spotify.com/v1/me/player", {
					headers: {
						Authorization: "Bearer " + this.spotifyAccesstoken,
						"Content-Type": "application/json",
					},
				});
				if (spotifyFetch.status === 204) {
					this.loaded = false;
					return;
				}
				this.loaded = true;

				const spotifyResult = await spotifyFetch.json();
				if (spotifyResult.error) {
					clearInterval(this.interval);
					throw new Error(spotifyResult);
				}

				this.track = spotifyResult as CurrentlyPlaying;
				this.refreshKey = !this.refreshKey;
				this.pendingRequest = false;
			} catch (e) {
				console.error("spotify track request error ", e);
			}
			//TODO: Token probably expired, try to refresh it
			// this.pendingRequest = false;
		},
		async getAccesstoken() {
			const fetchRes = await fetch("/api/external/spotify");
			const res = await fetchRes.json();

			if (!res?.data?.accesstoken) {
				throw new Error("Coulnd't fetch spotify credentials");
			}
			this.spotifyAccesstoken = res.data.accesstoken;
		},
	},
	async mounted() {
		await this.getAccesstoken();
		this.refreshTrack();

		const self = this;
		this.interval = setInterval(function () {
			self.refreshTrack();
		}, spotifyRefreshTimer);

		this.interval2 = setInterval(function () {
			if (self.track && self.track.progress_ms && self.track.is_playing) {
				self.track.progress_ms += smoothProgressBar;
				self.refreshKey = !self.refreshKey;
			}
		}, smoothProgressBar);

		await this.refreshTrack();
		this.loaded = true;
	},
	beforeDestroy() {
		if (this.interval2) clearInterval(this.interval2);
		if (this.interval) clearInterval(this.interval);
	},
	errorCaptured,
	components: { Base },
});
</script>
