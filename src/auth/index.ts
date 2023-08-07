import { UserFromAPI } from "@/helpers/types/user";
import oidc from "./oidc";

export interface AuthMethod {
	getUser: () => Promise<UserFromAPI | null>;
	getToken: () => Promise<string | null>;

	logout: () => Promise<void>;

	registerCallbacks: (signedInCallback: (user: UserFromAPI) => void, signedOutCallback: () => void) => void;
}

export default oidc satisfies AuthMethod;
