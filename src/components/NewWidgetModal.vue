<template>
	<Modal v-show="user.loggedIn && user.user && !dragging" @toggle="(state: boolean) => open=state">
		<template #button>
			<div class="absolute bottom-[-16px] justify-center flex w-full">
				<div class="p-[4rem] m-[-4rem]" :class="{ appear: !open }">
					<div class="w-8 h-8 rounded-full backdrop-blur-sm">
						<font-awesome-icon :icon="['fas', 'plus']" class="w-full h-full" />
					</div>
				</div>
			</div>
		</template>

		<template #title>Add new widget</template>

		<template #content>
			<h4 class="w-full text-center italic text-gray-300 p-0">These widgets are displayed with sample data</h4>

			<div class="pt-3 p-6 space-y-6 items-center flex flex-col">
				<draggable
					id="newly_created"
					:list="allItems"
					:group="{ name: 'widgets', put: false }"
					:item-key="generateKey"
					@start="start"
					@end="end">
					<template #item="{ element }">
						<div>
							<component :is="element.name" :sample="true"></component>
						</div>
					</template>
				</draggable>
			</div>
		</template>
	</Modal>
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
			dragging: false,
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
		generateKey,
		start() {
			this.dragging = true;
			this.$emit("dragging", true);
		},
		end() {
			this.dragging = false;
			this.$emit("dragging", false);
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
<style scoped>
.appear {
	transition: all 0.3s ease-in-out;
}

.appear:hover {
	transform: scale(2.5) translateY(-24px);
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
