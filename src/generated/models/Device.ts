/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BatteryInfo } from "./BatteryInfo";
import type { CpuInfo } from "./CpuInfo";
import type { NetworkInfo } from "./NetworkInfo";
import type { OsInfo } from "./OsInfo";
import type { RamInfo } from "./RamInfo";
import type { StorageInfo } from "./StorageInfo";

export type Device = {
	/**
	 * The unique identifier of the device
	 */
	uid: string;
	name: string;
	type: string;
	availableInformation: Array<any>;
	os?: OsInfo;
	cpu?: CpuInfo;
	ram?: RamInfo;
	storage?: StorageInfo;
	network?: NetworkInfo;
	battery?: BatteryInfo;
	contact: string;
};
