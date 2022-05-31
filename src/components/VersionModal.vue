<template>
	<div>
		<div class="rounded p-1" @click="toggle">
			<span :title="VUE_APP_VERCEL_GIT_COMMIT_SHA">{{ VUE_APP_VERCEL_GIT_COMMIT_SHA.slice(0, 7) }}</span>
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
						<div class="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
							<h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white text-center w-full">
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
						<div class="pt-1 p-6 space-y-6 text-base leading-relaxed text-gray-500 dark:text-gray-400">
							<p>
								This information is gathered from
								<a class="no-underline" href="https://vercel.com" target="_blank" rel="noopener noreferrer">
									<svg height="24" viewBox="0 0 284 65" fill="var(--geist-foreground)" aria-label="Vercel Logotype">
										<path
											d="M141.68 16.25c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm117.14-14.5c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm-39.03 3.5c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9v-46h9zM37.59.25l36.95 64H.64l36.95-64zm92.38 5l-27.71 48-27.71-48h10.39l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10v14.8h-9v-34h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
										></path>
									</svg>
								</a>
							</p>

							<table>
								<tbody>
									<tr>
										<td>Environment</td>
										<td>{{ VUE_APP_VERCEL_ENV }}</td>
									</tr>
									<tr>
										<td>Commit</td>
										<td>
											<a
												class="text-teal-500 no-underline"
												:href="`https://github.com/Thiesjoo/thies-home-page/commit/${VUE_APP_VERCEL_GIT_COMMIT_SHA}`"
												target="_blank"
												rel="noopener noreferrer"
												>{{ VUE_APP_VERCEL_GIT_COMMIT_SHA }}</a
											>
										</td>
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

							<h4 class="text-m font-semibold text-gray-900 lg:text-xl dark:text-white">
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
												'text-emerald-500': user.loggedIn,
												'text-rose-600': !user.loggedIn,
											}"
										>
											{{ user.loggedIn ? "Yes!" : "No" }}
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
import { windowEvent } from "@/helpers/constants";
import { useUserStore } from "@/store/user.store";
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
	setup() {
		return { user: useUserStore() };
	},
	beforeDestroy() {
		window.removeEventListener(windowEvent, listener.bind(this));
	},
	created() {
		window.addEventListener(windowEvent, listener.bind(this));
	},
});
</script>
<style>
td {
	padding: 5px 15px;
}
</style>
