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

async function logout() {
	await fetch(getBaseURL() + "/auth/refresh/logout", {
		method: "GET",
		credentials: "include",
	});
}

async function genericNetworkRequest(
	body: { [key: string]: string },
	headers: { [key: string]: string },
	url: string
): Promise<{ access: string; refresh: string; ok: boolean }> {
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

	return json;
}

export const loginService = {
	login,
	register,
	logout,
};
