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
		userStore.waitUntilLoaded().then(() => {
			next();
		});
	} else {
		next();
	}
});

export default router;
