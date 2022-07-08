<template>
	<div id="app">
		<div
			v-if="preview"
			class="absolute w-[300px] top-[10px] ml-[-100px] mt-[10px] left-0 p-3 -rotate-45 flex flex-col text-center bg-red-800/[40%] z-[100]"
		>
			<span class="font-extrabold"> PREVIEW </span>
			<span class="text-xs">{{ version }}</span>
		</div>
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
		<footer class="flex mx-2 fixed bottom-0 justify-center text-xs space-x-5">
			<VersionModalVue />
			<LoginVue />
		</footer>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { routes } from "./router/routes";
import VersionModalVue from "./components/VersionModal.vue";
import LoginVue from "./components/LoginModal.vue";
import { isProduction } from "./helpers/envParser";

export default defineComponent({
	computed: {
		routes: () => routes.filter((x) => !x.exclude),
		show: function () {
			let header = this.$route.meta.header;
			return header === undefined ? false : header;
		},
		preview: () => !isProduction(),
		version: () => window.env.VUE_APP_VERCEL_GIT_COMMIT_SHA.slice(0, 7),
	},
	watch: {
		$route: {
			immediate: true,
			handler(to, from) {
				document.title = to.name || "thies.dev";
			},
		},
	},
	components: { VersionModalVue, LoginVue },
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
	border-radius: 0.4em 0.4em 0 0;
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
