declare global {
	interface Window {
		env: {
			VUE_APP_VERCEL_ENV: "production" | "preview" | "development";
			VUE_APP_VERCEL_URL: string;
			VUE_APP_VERCEL_GIT_COMMIT_SHA: string;
			VUE_APP_VERCEL_GIT_COMMIT_MESSAGE: string;
			AUTHBASEURL: string;
			DEVICEBASEURL: string;
			PASSAGE_APP_ID: string;
		};
		openModals: number;
		turnstile?: {
			getResponse: () => Promise<string>;
			render: (
				element: string | HTMLElement,
				options: {
					sitekey: string;
					action: string;
					callback: Function;
					"expired-callback": Function | void;
					"error-callback": Function | void;
				}
			) => string;
			reset: (id: string) => void;
			remove: (id: string) => void;
		};
		onloadTurnstileCallback?: () => void;
	}
}

export const isProduction = () => {
	return window.env.VUE_APP_VERCEL_ENV == "production";
};
