import { useUserStore } from "@/store/user.store";
import { createWebHistory, createRouter } from "vue-router";
import { routes } from "./routes";

const router = createRouter({
	history: createWebHistory(),
	routes: routes,
});

router.beforeEach((to, from, next) => {
	const userStore = useUserStore();

	// we wanted to use the store here
	if (!to.meta.requiresLogin || userStore.loggedIn) {
		next();
	} else {
		next("/login?to=" + to.path);
	}
});

export default router;
