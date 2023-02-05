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
					<div class="relative p-10 h-auto">
						<div
							class="relative rounded-lg shadow bg-gray-700"
							:style="{
								backgroundColor,
							}">
							<div class="flex p-5 border-gray-600 justify-end flex-row items-center align-center">
								<h2
									class="mt-6 text-center w-full text-3xl font-extrabold text-white"
									style="position: absolute; left: 50%; transform: translateX(-50%); max-width: 70%">
									<slot name="title"> </slot>
								</h2>
								<button
									type="button"
									@click="toggle"
									class="text-gray-400 bg-transparent text-sm p-1 pt-0 z-10">
									<font-awesome-icon
										:icon="['fas', 'xmark']"
										size="lg"
										class="rounded-full hover:bg-gray-600 hover:text-white p-2 h-5 w-5" />
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
import { lightenDarkenColor } from "@/helpers/colors";
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		openOnMount: {
			type: Boolean,
			default: false,
		},
		color: {
			type: String,
			default: "",
		},
	},
	data(): {
		open: boolean;
	} {
		return {
			open: false,
		};
	},
	computed: {
		backgroundColor() {
			return this.$props.color ? this.$props.color : lightenDarkenColor("#374151", (window.openModals - 1) * -30);
		},
	},
	methods: {
		forceOpen() {
			if (this.open) return;
			this.toggle();
		},
		forceClose() {
			if (!this.open) return;
			this.toggle();
		},
		toggle() {
			this.open = !this.open;
			this.$emit("toggle", this.open);

			window.openModals += this.open ? 1 : -1;
		},
	},
	mounted() {
		if (this.openOnMount) this.toggle();
	},
	emits: ["toggle"],
});
</script>
