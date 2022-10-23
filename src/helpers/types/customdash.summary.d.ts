export interface Device {
	type: string;
	name: string;
	id: string;
	uptime: number;
	upsince: number;
	battery: number;
	batteryCharging: boolean;
	network: Network;
	connected: boolean;
	lastConnected: LastConnected;
	dateReceived: number;
}

export interface LastConnected {
	time: number;
	ip: string;
	location: Location;
}

export interface Location {
	age: number;
	lat: string;
	lon: string;
}

export interface Network {
	interval: number;
	up: number;
	down: number;
	ip4: string;
	ip6: string;
	type: string;
	extraInfo: string;
	dateReceived: number;
}
