<template>
	<div id="app">
		<header class="header" v-if="show">
			<div class="container">
				<nav class="header_menu">
					<ul>
						<li v-for="item in routes" :key="item.name">
							<router-link :to="item.path">{{ item.name }}</router-link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
		<div v-if="show" style="margin-top: 80px"></div>
		<router-view></router-view>
		<footer class="flex mx-2 fixed bottom-0 justify-center text-xs">
			<div class="rounded p-1" onclick="">
				<span>{{ githubSHA.slice(0, 7) }}</span>
			</div>
		</footer>
		<!-- <div
			class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full flex justify-center items-center"
		>
			<div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
				<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
					<div
						class="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600"
					>
						<h3
							class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white"
						>
							Terms of Service
						</h3>
						<button
							type="button"
							class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
						>
							<font-awesome-icon :icon="['fas', 'xmark']" size="lg" />
						</button>
					</div>
					<div class="p-6 space-y-6">
						<p
							class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
						>
							With less than a month to go before the European Union enacts new
							consumer privacy laws for its citizens, companies around the world
							are updating their terms of service agreements to comply.
						</p>
						<p
							class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
						>
							The European Union’s General Data Protection Regulation (G.D.P.R.)
							goes into effect on May 25 and is meant to ensure a common set of
							data rights in the European Union. It requires organizations to
							notify users as soon as possible of high-risk data breaches that
							could personally affect them.
						</p>
					</div>
					<div
						class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600"
					>
						<button
							type="button"
							class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							I accept
						</button>
						<button
							type="button"
							class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
						>
							Decline
						</button>
					</div>
				</div>
			</div>
		</div> -->
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { routes } from "./router/routes";

export default defineComponent({
	data() {
		return { githubSHA: window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA || "6969420" };
	},
	computed: {
		routes: () => routes.filter((x) => !x.exclude),
		show: function () {
			let header = this.$route.meta.header;
			return header === undefined ? false : header;
		},
	},
	watch: {
		$route: {
			immediate: true,
			handler(to, from) {
				document.title = to.name || "thies.dev";
			},
		},
	},
});
</script>

<style>
/*Fonts*/
@import url("https://fonts.googleapis.com/css?family=Montserrat:300,400,700&display=swap");

/*Base*/
* {
	margin: 0;
	padding: 0;
	border: 0;
	box-sizing: border-box;
	font: 100%;
	font-weight: normal;
	outline: none;
	vertical-align: baseline;
}

body {
	height: 100vh;
	background: #99aab5;
	font-family: "Montserrat", sans-serif;
}

.container {
	max-width: 80%;
	margin: 0 auto;
	padding: 0;
	position: relative;
}

@media only screen and (max-width: 1000px) {
	.container {
		max-width: 95%;
	}
}

footer > div {
	background-color: rgba(110, 231, 183, 0.4);
}

.header {
	position: fixed;
	top: 0px;
	width: 100%;
	background: #23272a;
	padding: 15px 0;
	z-index: 10;
}

.header_menu {
	text-align: center;
}

.header_menu ul {
	list-style-type: none;
}

.header_menu ul li {
	display: inline-block;
	margin: 10px;
}

.header_menu ul li a {
	color: #fff;
	font-weight: bold;
	text-transform: uppercase;
	text-decoration: none;
	font-size: 14px;
	line-height: 20px;
}
</style>
