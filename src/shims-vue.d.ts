/* eslint-disable */
declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

interface ImportMetaEnv {
	VITE_VERCEL_ENV: "production" | "preview" | "development";
	VITE_VERCEL_URL: string;
	VITE_VERCEL_GIT_COMMIT_SHA: string;
	VITE_VERCEL_GIT_COMMIT_MESSAGE: string;
	VITE_AUTHBASEURL: string;
	VITE_DEVICEBASEURL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
