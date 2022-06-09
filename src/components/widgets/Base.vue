<template>
	<Transition
		name="slide-fade"
		:enter-from-class="`enter-from-${right ? 'right' : 'left'}`"
		:leave-to-class="`enter-from-${right ? 'right' : 'left'}`"
	>
		<div class="p-2" v-if="loaded" @click="linkTo">
			<div
				class="inline-flex items-center bg-white leading-none text-purple-600 rounded-full p-2 shadow text-teal text-sm"
			>
				<span
					v-if="showShort"
					class="inline-flex text-white rounded-full h-6 px-3 justify-center items-center truncate"
					:class="[color ? 'bg-' + color + '-600' : '']"
				>
					<slot name="short"></slot>
				</span>
				<div class="flex flex-col items-center">
					<span class="inline-flex px-2" style="white-space: nowrap">
						<slot name="content"></slot>
					</span>
					<span class="text-purple-400 text-xs text-center w-full p-2 pb-0" v-if="showSubcontent">
						<slot name="subcontent"></slot>
					</span>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		color: String,
		loaded: Boolean,
		link: String,
	},
	computed: {
		showSubcontent() {
			return !!this.$slots.subcontent;
		},
		showShort() {
			return !!this.$slots.short;
		},
		left(): boolean {
			return !!this.$attrs.left;
		},
		right(): boolean {
			return !!this.$attrs.right;
		},
	},
	methods: {
		linkTo() {
			//@ts-ignore
			if (this.link) window.top.location.href = this.link;
		},
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

/* TODO: This animation moves from the left, but some components are on the right */
.enter-from-right {
	transform: translateX(20px);
	opacity: 0;
}

.enter-from-left {
	transform: translateX(-20px);
	opacity: 0;
}
</style>
