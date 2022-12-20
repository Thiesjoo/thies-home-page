<template>
	<div>
		<div @click="toggle">
			<slot name="button"></slot>
		</div>
		<div>
			<Transition>
				<div
					class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-100 w-[100vw] md:inset-0 h-modal h-[100vh] flex justify-center items-center"
					v-if="open"
					v-click-outside="toggle">
					<div class="relative p-4 w-full max-w-2xl h-auto">
						<div class="relative rounded-lg shadow bg-gray-700">
							<div class="flex justify-between items-start p-5 rounded-t border-b border-gray-600">
								<h2 class="mt-6 text-center w-full text-3xl font-extrabold">
									<slot name="title"> </slot>
								</h2>
								<!-- FIXME: The text is not centered, because button is not in the correct place -->
								<button
									type="button"
									@click="toggle"
									class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white">
									<font-awesome-icon :icon="['fas', 'xmark']" size="lg" />
								</button>
							</div>
							<div class="pt-1 p-6 space-y-6 text-base leading-relaxed text-gray-400">
								<slot name="content"></slot>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		openOnMount: {
			type: Boolean,
			default: false,
		},
	},
	data(): {
		open: boolean;
	} {
		return {
			open: false,
		};
	},
	methods: {
		toggle() {
			this.open = !this.open;
			this.$emit("toggle", this.open);
		},
	},
	mounted() {
		this.open = this.openOnMount;
		this.$emit("toggle", this.open);
	},
	emits: ["toggle"],
});
</script>
