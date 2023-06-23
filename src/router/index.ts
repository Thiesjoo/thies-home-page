import { useUserStore } from "@/store/user.store";
import { createWebHistory, createRouter, RouteLocationNormalized } from "vue-router";
import { routes } from "./routes";

const router = createRouter({
	history: createWebHistory(),
	routes: routes,
});

router.beforeEach(async (to, from, next) => {
	const userStore = useUserStore();

	console.log("Routing to: ", to);

	if (to.meta.requiresLogin) {
		console.log("Requires login");

		userStore
			.waitUntilLoggedinAndLoaded()
			.then(() => {
				next();
			})
			.catch(() => {
				next(`/login?to=${to.fullPath}`);
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
