export const routes = [
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
		component: () =>
			import(/* webpackChunkName: "users" */ "../views/Users.vue"),
		meta: {
			header: true,
		},
	},
	{
		path: "/rainbow",
		name: "Twitch Chat Tricks",
		component: () =>
			import(/* webpackChunkName: "rainbow" */ "../views/RainbowTwitch.vue"),
		exclude: true,
		meta: {
			header: true,
		},
	},
	{
		path: "/gh*",
		name: "Github Redirect",
		component: () =>
			import(/* webpackChunkName: "github" */ "../views/Github.vue"),
		exclude: true,
	},
	{
		path: "/home",
		name: "New tab",
		component: () =>
			import(/* webpackChunkName: "github" */ "../views/Dash.vue"),
		exclude: true,
	},
];
