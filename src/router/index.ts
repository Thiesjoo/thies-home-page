import { useUserStore } from "@/store/user.store";
import { createWebHistory, createRouter } from "vue-router";
import { routes } from "./routes";

const router = createRouter({
	history: createWebHistory(),
	routes: routes,
});

router.beforeEach((to, from, next) => {
	const userStore = useUserStore();

	if (to.meta.requiresLogin && !userStore.loggedIn) {
		console.log("User not logged in, redirecting to login page");
		next("/login?to=" + to.path);
	} else if (to.meta.requiresLogin) {
		console.log("User logged in, waiting for user data to be loaded");
		userStore
			.waitUntilLoaded()
			.then(() => {
				next();
			})
			.catch(() => {
				next("/login?to=" + to.path);
			});
	} else {
		next();
	}
});

export function enableLogoutWatching() {
	// Watch the store for changes, and when a user logs out, redirect to the login page if on auth-required page
	useUserStore().$subscribe((mut, state) => {
		if (!state.loggedIn && router.currentRoute.value.meta.requiresLogin) {
			router.push("/login?to=" + router.currentRoute.value.path);
		}
	});
}

export default router;
