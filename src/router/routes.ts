import { RouteRecordRaw } from "vue-router";

export type Route = RouteRecordRaw & {
	meta?: {
		/** Should the header be shown on this page. Default: false */
		header?: boolean;
		requiresLogin?: boolean;
	};
	/** Should this route be shown in the header */
	exclude?: boolean;
};

export const routes: Route[] = [
	{
		path: "/",
		name: "About me!",
		component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
		meta: {
			header: true,
		},
	},
	{
		path: "/users",
		name: "Twitch Viewer list",
		component: () => import(/* webpackChunkName: "users" */ "../views/Users.vue"),
		meta: {
			header: true,
		},
	},
	{
		path: "/rainbow",
		name: "Twitch Chat Tricks",
		component: () => import(/* webpackChunkName: "rainbow" */ "../views/RainbowTwitch.vue"),
		exclude: true,
		meta: {
			header: true,
		},
	},
	{
		path: "/gh*",
		name: "Github Redirect",
		component: () => import(/* webpackChunkName: "github" */ "../views/Github.vue"),
		exclude: true,
	},
	{
		path: "/home",
		name: "New tab",
		component: () => import(/* webpackChunkName: "newtab" */ "../views/Dash.vue"),
		exclude: true,
	},
	{
		path: "/devices",
		name: "Your devices",
		component: () => import(/* webpackChunkName: "device" */ "../views/Devices.vue"),
		exclude: true,
		meta: {
			requiresLogin: true,
		},
	},
	{
		path: "/login",
		name: "Login",
		component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue"),
		exclude: true,
	},
	{
		path: "/login/callback",
		name: "Login Callback",
		component: () => import(/* webpackChunkName: "login" */ "../views/OIDCLoginCallback.vue"),
		exclude: true,
	},
];
