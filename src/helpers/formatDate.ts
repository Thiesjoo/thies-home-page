import { nl } from "date-fns/locale";
import { format } from "date-fns";

export function formatDate(value: Date) {
	if (value) {
		console.log("Got here,", value);
		return format(value, "HH:mm:ss", { locale: nl });
	}
	return "";
}
