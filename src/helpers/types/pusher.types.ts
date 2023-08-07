import { Device, Notification } from "@/generated";
export type Timestamp = { dateReceived: number };

export type CpuInfo = {
	brand: string;
	model: string;
	cores: number;
	threads: number;
	frequency: number;
};
export type CpuLoad = {
	load: {
		core: number;
		load: number;
		temp: number;
	}[];
};

export type RamInfo = {
	size: number;
	layout: {
		brand?: string;
		type?: string;
		frequency?: number;
	}[];
};
export type RamLoad = { usage: number };

export type StorageInfo = {
	layout: {
		device: string;
		brand: string;
		size: number;
		type: string;
		raidGroup?: string;
		virtual?: boolean;
	}[];
};
export type StorageLoad = { load: number; used?: number; type?: string; name?: string }[];

export type NetworkInfo = {};

export type NetworkLoad = {
	up: number;
	down: number;
	type: "wifi" | "ethernet" | "mobile";
	extraInfo: string;
	ip4: string;
	ip6: string;
};

export type OsInfo = {
	guid: string;
	hostname: string;
	platform?: string;
	distro?: string;
	release?: string;
	kernel?: string;
	arch?: string;
	// Uptime in seconds
	uptime: number;
	// Up since a date in Unix timestamp in milliseconds?
	upSince: number;
};

export type OsLoad = {
	networkInfo: NetworkLoad["extraInfo"];
	location: {
		lat: string;
		lon: string;
	};
	bluetooth: string;
};

export type GlobalLoad = {
	// Is this device currently connected to the server
	connected: boolean;
	lastConnected: {
		time: number;
		ip: string;
		location?: {
			lat: string;
			lon: string;
			// Age in unix timestamp in milliseconds
			age: number;
		};
	};
	battery?: number;
	charging?: boolean;
};

export type BluetoothLoad = {
	scanning: boolean;
} & (
	| {
			connected: true;
			device: string;
			battery?: number;
	  }
	| { connected: false }
);

export type BatteryInfo =
	| {
			hasBattery: true;
			maxCapacity?: number;
			model?: string;
	  }
	| {
			hasBattery: false;
	  };

export type BatteryLoad = {
	currentCapacity?: number;
	percent: number;
	charging: boolean;
	voltage?: number;
	power?: number;
	temperature?: number;
};

export type MobileLoad = {
	// Do not disturb on
	dnd: boolean;
	// Is the wifihostpot enabled
	hotspot: boolean;
};

export type NotificationLoad =
	| {
			uid: string;
			removed: true;
	  }
	| (Notification & {
			uid: string;
			removed: false;
	  });

// export type PossibleInfo = (HardwareInfo | MobileInfo) & { dateCreated: number };

export type PossibleWidgets = "os" | "cpu" | "storage" | "ram" | "network" | "bluetooth" | "battery" | "mobile";
export type LiveData = {
	cpu: CpuLoad;
	ram: RamLoad;
	network: NetworkLoad;
	bluetooth: BluetoothLoad;
	battery: BatteryLoad;
	global: GlobalLoad;
	mobile: MobileLoad;
	notifications: NotificationLoad;
};

export type LiveDataSnapshot = { [A in keyof LiveData]: LiveData[A] & Timestamp };
export type LiveDataList = { [K in keyof LiveData]?: Array<LiveData[K] & Timestamp> };

export type FullDevice = Device & { livedata: LiveDataSnapshot };
