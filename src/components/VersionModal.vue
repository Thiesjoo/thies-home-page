<template>
	<div>
		<div class="rounded p-1" @click="toggle">
			<span :title="VUE_APP_VERCEL_GIT_COMMIT_SHA">{{
				VUE_APP_VERCEL_GIT_COMMIT_SHA.slice(0, 7)
			}}</span>
		</div>
		<div>
			<!-- MODAL -->
			<div
				class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full flex justify-center items-center"
				v-if="open"
				v-click-outside="toggle"
			>
				<div class="relative p-4 w-full max-w-2xl h-full md:h-auto z-100">
					<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
						<div
							class="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600"
						>
							<h3
								class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white"
							>
								Current version: {{ VUE_APP_VERCEL_GIT_COMMIT_SHA }}
							</h3>
							<button
								type="button"
								@click="toggle"
								class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
							>
								<font-awesome-icon :icon="['fas', 'xmark']" size="lg" />
							</button>
						</div>
						<div
							class="p-6 space-y-6 text-base leading-relaxed text-gray-500 dark:text-gray-400"
						>
							<p>This information is gathered from vercel statistics</p>

							<table>
								<tbody>
									<tr>
										<td>Environment</td>
										<td>{{ VUE_APP_VERCEL_ENV }}</td>
									</tr>
									<tr>
										<td>Commit</td>
										<td>{{ VUE_APP_VERCEL_GIT_COMMIT_SHA }}</td>
									</tr>
									<tr>
										<td>Commit message</td>
										<td>{{ VUE_APP_VERCEL_GIT_COMMIT_MESSAGE }}</td>
									</tr>
									<tr>
										<td>Deployed on URL</td>
										<td>{{ VUE_APP_VERCEL_URL }}</td>
									</tr>
								</tbody>
							</table>

							<h4
								class="text-m font-semibold text-gray-900 lg:text-xl dark:text-white"
							>
								Networking stats for this session
							</h4>
							<table>
								<tbody>
									<tr>
										<td>Failed fetches</td>
										<td>{{ failedFetches }}</td>
									</tr>
									<tr>
										<td>Failed requests</td>
										<td>{{ failedRequests }}</td>
									</tr>
									<tr>
										<td>Authenticated</td>
										<td
											:class="{
												'text-emerald-500': authenticated,
												'text-rose-600': !authenticated,
											}"
										>
											{{ authenticated ? "Yes!" : "No ):" }}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

function listener() {
	//@ts-ignore
	this.failedFetches = window.networking.failedFetches;
	//@ts-ignore
	this.failedRequests = window.networking.failedRequests;
}

export default defineComponent({
	data() {
		return {
			...window.env,
			...window.networking,
			open: false,
		};
	},
	methods: {
		toggle() {
			this.open = !this.open;
		},
	},
	beforeDestroy() {
		window.removeEventListener("currentlyLoadingRequests", listener.bind(this));
	},
	created() {
		window.addEventListener("currentlyLoadingRequests", listener.bind(this));
	},
});
</script>
<style>
td {
	padding: 0 15px;
}
</style>
