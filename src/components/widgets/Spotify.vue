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
import { isProduction } from "@/helpers/envParser";
import { CurrentlyPlaying, Track } from "@/helpers/types/spotify.api";
import { defineComponent, ref } from "@vue/runtime-core";
import { pausableFilter, RemovableRef, StorageSerializers, useLocalStorage } from "@vueuse/core";
import axios from "axios";
import ms from "ms";
import { Base } from "./";
import errorCaptured from "./errorCaptured";

/** How often to ping spotify for music change */
const spotifyRefreshTimer = isProduction() ? ms("5s") : ms("20s");
/** How often to increase our own timer of the progress bar */
const smoothProgressBar = 500;

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
	props: {
		sample: { type: Boolean },
	},
	data(): {
		//Because track is an object, we need a refreshKey for vue to detect changes
		pendingRequest: boolean;
		refreshKey: boolean;
		loaded: boolean;
		spotifyAccesstoken?: string;
		localProgress: number;
		playerLoopInterval?: number;
		progressInterval?: number;
	} {
		const toReturn = {
			localProgress: 0,
			loaded: false,
			refreshKey: false,
			pendingRequest: false,
		};
		// If we have fetched data in the last 5 seconds, there must be another tab open.
		// We can just copy that data and stay loaded without waiting

		//@ts-ignore Somewhat illegal stuff because track is already loaded in setup.
		const offset = Date.now() - (this?.track?.timestamp || 0);

		if (offset < spotifyRefreshTimer - 500) {
			toReturn.loaded = true;
			//@ts-ignore
			toReturn.localProgress = (this.track?.progress_ms || 0) + offset;
		}
		return toReturn;
	},
	computed: {
		renderTrack(): boolean {
			this.refreshKey;

			return !!this?.track;
		},
		current(): string {
			this.refreshKey;

			return secondsToTimeString(this.localProgress / 1000);
		},
		end(): string {
			this.refreshKey;
			return secondsToTimeString((this.track?.item?.duration_ms || 0) / 1000);
		},
		percentage(): number {
			this.refreshKey;

			return this.track ? Math.min((this.localProgress / (this.track.item?.duration_ms || 0)) * 100, 100) : 0;
		},
		imageURL(): string {
			this.refreshKey;

			return (this.track?.item as Track)?.album?.images[0]?.url || "https://via.placeholder.com/150";
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
			// TODO: Is pending request really needed
			if (!this.spotifyAccesstoken || this.pendingRequest) return;
			const offset = Date.now() - (this.track?.timestamp || 0);

			if (offset < spotifyRefreshTimer - 500) {
				this.localProgress = (this.track?.progress_ms || 0) + offset;
				console.log("There was data fetched more recently. Probably other tab?");
				return;
			}

			this.pendingRequest = true;
			try {
				// TODO: Refresh interceptor for this
				const spotifyFetch = await axios.get("https://api.spotify.com/v1/me/player", {
					withCredentials: false,
					headers: {
						Authorization: "Bearer " + this.spotifyAccesstoken,
						"Content-Type": "application/json",
					},
				});
				if (spotifyFetch.status === 204) {
					//@ts-ignore
					this.track = { timestamp: Date.now() };
					this.loaded = false;
					return;
				}
				this.loaded = true;

				const spotifyResult = spotifyFetch.data;
				if (spotifyResult.error) {
					clearInterval(this.playerLoopInterval);
					throw new Error(spotifyResult);
				}

				this.track = spotifyResult as CurrentlyPlaying;
				this.localProgress = this.track.progress_ms || 0;
				if (this.track) {
					this.track.timestamp = Date.now();
				}

				this.refreshKey = !this.refreshKey;
				this.pendingRequest = false;
			} catch (e) {
				console.error("spotify track request error ", e);
			}
		},
		async getAccesstoken() {
			const fetchRes = await axios.get("/api/external/spotify", { baseURL: "/" });
			const res = fetchRes.data;

			if (!res?.data?.accesstoken) {
				throw new Error("Coulnd't fetch spotify credentials");
			}
			this.spotifyAccesstoken = res.data.accesstoken;
		},
	},
	setup() {
		const filter = pausableFilter();
		return {
			track: useLocalStorage<CurrentlyPlaying | null>("SPOTIFY-track", null, {
				serializer: StorageSerializers.object,
				eventFilter: filter.eventFilter,
			}),
			pausable: filter.pause,
		};
	},
	async mounted() {
		if (this.sample) {
			this.loaded = true;
			this.pausable();
			this.localProgress = ms("30sec");
			this.track = {
				item: {
					duration_ms: ms("1m"),
					name: "Sample image",
					artists: ["Sample artist", "Sample artist 2"].map((x) => {
						return { name: x };
					}),
				},
				progress_ms: ms("30sec"),
			} as unknown as CurrentlyPlaying;
			return;
		}

		await this.getAccesstoken();
		await this.refreshTrack();

		const self = this;
		this.playerLoopInterval = setInterval(function () {
			self.refreshTrack();
		}, spotifyRefreshTimer);

		this.progressInterval = setInterval(function () {
			if (self.track && self.track.progress_ms && self.track.is_playing) {
				self.localProgress += smoothProgressBar;
				self.refreshKey = !self.refreshKey;
			}
		}, smoothProgressBar);
		this.loaded = true;
	},
	beforeDestroy() {
		if (this.progressInterval) clearInterval(this.progressInterval);
		if (this.playerLoopInterval) clearInterval(this.playerLoopInterval);
	},
	errorCaptured,
	components: { Base },
});
</script>
