<template>
	<Modal>
		<template #button>
			<a
				class="text-white no-underline border border-transparent py-2 px-4 flex flex-row justify-center items-center rounded-md mx-2"
				style="background-color: rgb(50, 100, 10)">
				<font-awesome-icon :icon="[`fas`, `star`]" class="mr-2" />
				Manage Favorites
			</a>
		</template>

		<template #title>Manage Favorites</template>

		<template #content>
			<div class="flex items-center flex-col min-w-[25vw]" v-if="!userStore.isLoading">
				<draggable
					v-model="userStore.favorites"
					group="favorites"
					:item-key="(item: any) => item.url + item.name">
					<template #item="{ element, index }">
						<div class="bg-gray-900 rounded-md m-3 p-2 flex flex-row items-center text-lg w-full">
							<font-awesome-icon :icon="['fas', 'star']" class="mr-2" size="lg" />
							<span class="font-bold text-base flex flex-row flex-grow align-center items-center"
								>{{ element.name }} - {{ element.url }}
							</span>
							<div @click="() => deleteFavor(index)">
								<font-awesome-icon :icon="['fas', 'trash']" class="ml-5 text-red-500" />
							</div>
						</div>
					</template>
					<template #footer>
						<button
							@click="newFavorite"
							class="bg-green-900 rounded-md m-3 p-2 flex flex-row items-center font-bold text-base w-full">
							Add new favorite
						</button>
					</template>
				</draggable>
			</div>
		</template>
	</Modal>
</template>
<script lang="ts">
import { useUserStore } from "@/store/user.store";
import draggable from "vuedraggable";
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";

export default defineComponent({
	methods: {
		async deleteFavor(id: number) {
			this.favorites.splice(id, 1);
		},
		newFavorite() {
			const name = prompt("Enter a name for your new favorite");
			const url = prompt("Enter a url for your new favorite");

			if (!name || !url) {
				const toast = useToast();
				toast.warning("You need to enter a name and url for your new favorite");
				return;
			}

			this.userStore.favorites.push({ name, url });
		},
	},
	setup() {
		const userStore = useUserStore();
		return { userStore, favorites: userStore.favorites, toast: useToast() };
	},
	components: {
		draggable,
	},
});
</script>
