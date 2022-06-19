import axios from "axios";

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
	await axios.get("/auth/refresh/logout");
}

async function genericNetworkRequest(
	body: { [key: string]: string },
	headers: { [key: string]: string },
	url: string
): Promise<{ access: string; refresh: string; ok: boolean }> {
	const fetchRes = await axios(url, {
		method: "POST",
		data: body,
		headers: {
			...headers,
		},
	});

	const json = fetchRes.data;
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
