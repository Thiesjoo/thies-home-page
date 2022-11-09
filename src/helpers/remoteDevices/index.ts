import ms from "ms";
import { Device } from "../types/customdash.summary";

const MAX_AGE = ms("30m");
const WARNING_AGE = ms("15m");

export function getColorForAge(device: Device, now: number) {
	const difference = device.connected ? 0 : now - device.lastConnected.time;
	if (difference > MAX_AGE) {
		return "#FF5D5A";
	} else if (difference > WARNING_AGE || !device.connected) {
		return "#f5c350";
	} else {
		return "#65cd57";
	}
}

export function getTitleType(device: Device) {
	return device.type.charAt(0).toUpperCase() + device.type.slice(1);
}
export function getIconForDeviceType(device: Device) {
	switch (device.type) {
		case "mobile":
			return ["fas", "mobile"];
		case "laptop":
			return ["fas", "laptop"];
		default:
			return ["fas", "desktop"];
	}
}
export function isInformationTooOld(device: Device, now: number, warning = false) {
	return now - device.lastConnected.time > (warning ? WARNING_AGE : MAX_AGE);
}
export function informationAgeShortText(device: Device, now: number) {
	if (device.connected) {
		return "Connected";
	}
	return ms(now - device.lastConnected.time);
}
export function getIconForLTEStrength(device: Device) {
	return ["fas", "signal"];
}
export function getIconForWifiStrength(device: Device) {
	return ["fas", "wifi"];
}

export function getNetworkTypeTitle(device: Device) {
	if (!device.network) {
		return "No network";
	}
	return device.network.type.charAt(0).toUpperCase() + device.network.type.slice(1);
}

const MAX_WIFI_NAME_LENGTH = 11;

export function getNetworkTitle(device: Device, ignoreLength = false) {
	if (!device.network) {
		return "No network data";
	}

	if (device.network.type === "ethernet") {
		return "Ethernet";
	}

	const extraInfo = device.network.extraInfo?.split(" ")[0];

	if (extraInfo === "undefined" || !extraInfo || extraInfo === "-") {
		return "unknown";
	}

	const tooLong = ignoreLength ? false : extraInfo.length > MAX_WIFI_NAME_LENGTH;

	return extraInfo.slice(0, tooLong ? MAX_WIFI_NAME_LENGTH : 1000) + (tooLong ? "..." : "");
}

export function getColorForBattery(device: Device, background = false) {
	const base = {
		"text-green-600": device.battery > 50,
		"text-yellow-600": device.battery > 25 && device.battery <= 50,
		"text-red-600": device.battery <= 25,
		"text-gray-400": !hasBattery(device),
	};
	if (background) {
		// Rename all keys to bg-*
		return Object.fromEntries(Object.entries(base).map(([key, value]) => [key.replace("text", "bg"), value]));
	}
	return base;
}

export function getIconForNetworkStatus(device: Device) {
	if (!device.network) {
		return ["fas", "question"];
	}
	switch (device.network.type) {
		case "wifi":
			return getIconForWifiStrength(device);
		case "lte":
			return getIconForLTEStrength(device);
		case "ethernet":
			return ["fas", "ethernet"];
		default:
			return ["fas", "plane-up"];
	}
}
export function hasBattery(device: Device) {
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
