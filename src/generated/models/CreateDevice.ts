/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BatteryInfo } from "./BatteryInfo";
import type { CpuInfo } from "./CpuInfo";
import type { NetworkInfo } from "./NetworkInfo";
import type { OsInfo } from "./OsInfo";
import type { RamInfo } from "./RamInfo";
import type { StorageInfo } from "./StorageInfo";

export type CreateDevice = {
	availableInformation: Array<"os" | "cpu" | "ram" | "network" | "bluetooth" | "battery" | "mobile">;
	name: string;
	type: string;
	os?: OsInfo;
	cpu?: CpuInfo;
	ram?: RamInfo;
	storage?: StorageInfo;
	network?: NetworkInfo;
	battery?: BatteryInfo;
	contact: string;
};
