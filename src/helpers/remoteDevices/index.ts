import ms from "ms";
import { FullDevice } from "../types/pusher.types";

const MAX_AGE = ms("30m");
const WARNING_AGE = ms("15m");

export function getColorForAge(device: FullDevice, now: number) {
	const difference = device.livedata?.global?.connected
		? 0
		: now - (device.livedata?.global?.lastConnected?.time || 10000000);
	if (difference > MAX_AGE) {
		return "#FF5D5A";
	} else if (difference > WARNING_AGE || (device.type !== "mobile" && !device.livedata?.global?.connected)) {
		return "#f5c350";
	} else {
		return "#65cd57";
	}
}

export function getTitleType(device: FullDevice) {
	return device.type.charAt(0).toUpperCase() + device.type.slice(1);
}

export function getIconForDeviceType(device: FullDevice) {
	switch (device.type) {
		case "mobile":
			return ["fas", "mobile"];
		case "laptop":
			return ["fas", "laptop"];
		default:
			return ["fas", "desktop"];
	}
}

export function isInformationTooOld(device: FullDevice, now: number, warning = false) {
	return now - (device.livedata.global?.lastConnected?.time || 10000000) > (warning ? WARNING_AGE : MAX_AGE);
}

export function informationAgeShortText(device: FullDevice, now: number) {
	if (device.livedata?.global?.connected) {
		return "Connected";
	}
	if (!device.livedata?.global?.lastConnected?.time) {
		return "Never connected";
	}
	let diff = now - (device.livedata?.global?.lastConnected?.time || 0);
	if (diff < 1000) {
		diff = 1001;
	}
	return ms(diff);
}

export function getIconForLTEStrength(device: FullDevice) {
	return ["fas", "signal"];
}

export function getIconForWifiStrength(device: FullDevice) {
	return ["fas", "wifi"];
}

export function getNetworkTypeTitle(device: FullDevice) {
	if (!device.network) {
		return "No network";
	}
	return device.livedata.network.type.charAt(0).toUpperCase() + device.livedata.network.type.slice(1);
}

const MAX_WIFI_NAME_LENGTH = 11;

export function getNetworkTitle(device: FullDevice, ignoreLength = false) {
	if (!device.livedata.network) {
		return "No network data";
	}

	if (device.livedata.network.type === "ethernet") {
		return "Ethernet";
	}

	const extraInfo = device.livedata.network.extraInfo?.split(" ")[0];

	if (extraInfo === "undefined" || !extraInfo || extraInfo === "-") {
		return "unknown";
	}

	const tooLong = ignoreLength ? false : extraInfo.length > MAX_WIFI_NAME_LENGTH;

	return extraInfo.slice(0, tooLong ? MAX_WIFI_NAME_LENGTH : 1000) + (tooLong ? "..." : "");
}

// Outputs an object with the color classes for the battery (In VUE format)
export function getColorForBattery(device: FullDevice, background = false) {
	const pc = device.livedata?.battery?.percent || 100;
	const base = {
		"text-green-600": pc > 50,
		"text-yellow-600": pc > 25 && pc <= 50,
		"text-red-600": pc <= 25,
		"text-gray-600": !hasBattery(device),
	};
	if (background) {
		// Rename all keys to bg-*
		return Object.fromEntries(Object.entries(base).map(([key, value]) => [key.replace("text", "bg"), value]));
	}
	return base;
}

export function getIconForNetworkStatus(device: FullDevice) {
	if (!device.livedata.network) {
		return ["fas", "question"];
	}
	switch (device.livedata.network.type) {
		case "wifi":
			return getIconForWifiStrength(device);
		case "mobile":
			return getIconForLTEStrength(device);
		case "ethernet":
			return ["fas", "ethernet"];
		default:
			return ["fas", "plane-up"];
	}
}
export function hasBattery(device: FullDevice) {
	return device.battery !== undefined;
}

export const allHelperFunctions = {
	getTitleType,
	getIconForDeviceType,
	isInformationTooOld,
	getColorForAge,
	informationAgeShort: informationAgeShortText,
	getIconForLTEStrength,
	getIconForWifiStrength,
	getNetworkTypeTitle,
	getIconForNetworkStatus,
	hasBattery,
	getNetworkTitle,
	getColorForBattery,
};
