declare global {
	interface Window {
		env: {
			VUE_APP_VERCEL_ENV: "production" | "preview" | "development";
			VUE_APP_VERCEL_URL: string;
			VUE_APP_VERCEL_GIT_COMMIT_SHA: string;
			VUE_APP_VERCEL_GIT_COMMIT_MESSAGE: string;
			AUTHBASEURL: string;
			DEVICEBASEURL: string;
		};
	}
}

export const isProduction = () => {
	return window.env.VUE_APP_VERCEL_ENV == "production";
};
