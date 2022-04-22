<template>
	<Transition name="slide-fade">
		<div class="p-2" v-if="loaded" @click="linkTo">
			<div
				class="inline-flex items-center bg-white leading-none text-purple-600 rounded-full p-2 shadow text-teal text-sm max-w-sm"
			>
				<span
					class="inline-flex text-white rounded-full h-6 px-3 justify-center items-center"
					:class="[color ? 'bg-' + color + '-600' : '']"
					style="max-width: 50%"
				>
					<slot></slot>
				</span>
				<span class="inline-flex px-2" style="white-space: nowrap">{{
					getValue
				}}</span>
			</div>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		color: String,
		val: {
			type: [Function, String],
			default: "lol",
		},
		link: String,
	},
	data(): { loaded: boolean; precomputed: string } {
		return {
			loaded: false,
			precomputed: "...",
		};
	},
	computed: {
		getValue() {
			return typeof this.val === "function" ? this.precomputed : this.val;
		},
	},
	methods: {
		linkTo() {
			if (this.link) window.location.href = this.link;
		},
	},
	async created() {
		try {
			this.precomputed =
				typeof this.val === "function" ? await this.val() : this.val;
			this.loaded = true;
		} catch (e) {
			console.warn(
				"Component with val: ",
				(this.val as Function).name,
				"failed to load with error: ",
				e
			);
		}
	},
});
</script>

<style>
.slide-fade-enter-active {
	transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateX(20px);
	opacity: 0;
}
</style>
