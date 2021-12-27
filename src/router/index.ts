import { createWebHistory, createRouter } from "vue-router";
import { routes } from "./routes";

const router = createRouter({
	history: createWebHistory(process.env.BASE_UR),
	routes,
});

export default router;
