<template>
	<div v-if="user.loggedIn && user.user">
		<div class="absolute bottom-[-16px] justify-center flex w-full">
			<div class="p-[4rem] m-[-4rem]" :class="{ appear: !open }" @click="open = true">
				<div class="w-8 h-8 rounded-full backdrop-blur-sm">
					<font-awesome-icon :icon="['fas', 'plus']" class="w-full h-full" />
				</div>
			</div>
		</div>
		<Transition>
			<!-- MODAL -->
			<div
				class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 w-full md:inset-0 h-modal md:h-full flex justify-center items-center"
				v-if="open"
				v-show="dragging"
				v-click-outside="toggle"
			>
				<div class="relative p-4 w-full max-w-2xl h-full md:h-auto z-100">
					<div class="relative rounded-lg shadow bg-gray-700">
						<div class="flex justify-between items-start p-5 rounded-t border-b border-gray-600">
							<h2 class="mt-6 text-center w-full text-3xl font-extrabold">Add new widget</h2>
							<button
								type="button"
								@click="toggle"
								class="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
							>
								<font-awesome-icon :icon="['fas', 'xmark']" size="lg" />
							</button>
						</div>

						<div class="pt-1 p-6 space-y-6 items-center flex flex-col">
							<draggable
								id="newly_created"
								:list="allItems"
								group="widgets"
								:item-key="generateKey"
								@start="start"
								@end="end"
							>
								<template #item="{ element }">
									<div>
										<component :is="element.name"></component>
									</div>
								</template>
							</draggable>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
<script lang="ts">
import { DEFAULT_WIDGETS, useUserStore, Widget } from "@/store/user.store";
import { defineComponent } from "vue";
import * as Widgets from "@/components/widgets";
import draggable from "vuedraggable";
import { generateKey, makeUnique } from "@/helpers/generateKeyFromWidget";

export default defineComponent({
	data() {
		return {
			open: false,
			dragging: true,
		};
	},
	computed: {
		allItems(): Widget[] {
			return makeUnique(
				[
					...this.user!.user!.settings!.widgetsAvailable,
					...DEFAULT_WIDGETS.map((x, i) => {
						return { name: x, id: i + "" } as Widget;
					}),
				],
				true
			);
		},
	},
	methods: {
		toggle() {
			this.open = !this.open;
		},
		generateKey,
		start() {
			this.dragging = false;
		},
		end() {
			this.dragging = true;
		},
	},
	setup() {
		const userStore = useUserStore();

		return { user: userStore };
	},
	async created() {},
	mounted() {},
	components: { ...Widgets, draggable },
});
</script>
<style>
.appear {
	transition: all 0.3s ease-in-out;
}

.appear:hover {
	transform: scale(3) translateY(-32px);
}

.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
