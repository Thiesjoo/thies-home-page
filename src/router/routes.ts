export const routes = [
	{
		path: "/",
		name: "About me!",
		component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
	},
	// {
	//   path: '/ranking',
	//   name: 'GuanTheBot Typo Ranking',
	//   component: () => import(/* webpackChunkName: "about" */ '../views/Ranking.vue')
	// },
	{
		path: "/users",
		name: "Twitch Viewer list",
		component: () =>
			import(/* webpackChunkName: "users" */ "../views/Users.vue"),
	},
	{
		path: "/rainbow",
		name: "Twitch Chat Tricks",
		component: () =>
			import(/* webpackChunkName: "rainbow" */ "../views/RainbowTwitch.vue"),
	},
	{
		path: "/gh*",
		name: "Github Redirect",
		component: () =>
			import(/* webpackChunkName: "github" */ "../views/Github.vue"),
		exclude: true,
	},
];
