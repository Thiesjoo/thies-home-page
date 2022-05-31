import { getBaseURL } from "@/helpers/auto-refresh-tokens";

export type LoginInformation = {
	email: string;
	password: string;
	recaptchaToken: string;
};

export type RegisterInformation = LoginInformation & { name: string };

function login(data: LoginInformation) {
	return genericNetworkRequest(data, { recaptcha: data.recaptchaToken }, "/auth/local/login");
}

function register(data: RegisterInformation) {
	return genericNetworkRequest(data, { recaptcha: data.recaptchaToken }, "/auth/local/register");
}

async function genericNetworkRequest(body: { [key: string]: any }, headers: { [key: string]: any }, url: string) {
	const fetchRes = await fetch(getBaseURL() + url, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		credentials: "include",
	}).catch((e) => {
		throw new Error("Network connectivity to server is unstable");
	});

	const json = await fetchRes.json();
	if (!json.access) {
		throw new Error(json.message || json.error || "Something went wrong with getting the access token");
	}

	return true;
}

export const loginService = {
	login,
	register,
};
