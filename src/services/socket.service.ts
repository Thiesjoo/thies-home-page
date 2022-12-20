import { useDevicesStore } from "@/store/device.store";
import { useUserStore } from "@/store/user.store";
import { io, Socket } from "socket.io-client";

class SocketService {
	socket?: Socket;
	store?: ReturnType<typeof useDevicesStore>;
	constructor() {}

	async setupSocketConnection() {
		console.log("Starting to setup socket connection");
		const store = useDevicesStore();
		const userStore = useUserStore();

		this.store = store;
		console.log("Waiting for URL");
		const url = await this.waitForDeviceURL();
		console.log("Got base URL:", url);
		// Append auth token as a query parameter, because websocket initialization requests do not carry extra headers
		const finalURL = `${url}?access_token=${userStore.accessToken}`;

		this.socket = io(finalURL, {
			extraHeaders: {
				Authorization: `Bearer ${userStore.accessToken}`,
			},
			transports: ["websocket"],
		});

		store.socket.connecting = false;
		store.socket.error = "";

		this.socket.on("connect", () => {
			store.socket.connected = true;
			store.socket.connecting = false;

			console.log("Connected to socket");
		});

		this.socket.on("connect_error", (err) => {
			store.socket.connected = false;
			store.socket.connecting = false;
			store.socket.error = err.message;
			console.error("SOCKETIO Connection error: ", err);
		});

		this.socket.on("disconnect", () => {
			console.log("Disconnected from socket");
			store.socket.connected = false;
			store.socket.connecting = false;
		});

		this.socket.on("reconnect", () => {
			console.log("Reconnected to socket");
			store.socket.connected = true;
			store.socket.connecting = false;
		});

		this.registerSocketEvents();
		this.registerStoreEvents();
	}

	registerSocketEvents() {
		if (!this.store) {
			console.error("Store not initialized, but it is needed for socket events");
			return;
		}

		const updateMap = {
			"battery-load": this.store.updateBatteryLoad,
			"global-load": this.store.updateGlobalLoad,
			"network-load": this.store.updateNetworkLoad,
			"cpu-load": this.store.updateCPULoad,
		};

		this.socket?.on("initial-data", console.log);
		this.socket?.onAny((event, ...args) => {
			if (event.endsWith("-load")) {
				console.log("Got event: ", event, args);
			}

			const updateFunction = updateMap[event as "battery-load" | "global-load"];
			if (!updateFunction) {
				console.warn("No update function for event: ", event);
				return;
			}

			const [data] = args as [any & { deviceId: string }];
			updateFunction(data.deviceId, data);
		});
	}

	registerStoreEvents() {
		// Check if we want new data
		this.store?.$subscribe((mut, state) => {
			if (state.requests.length > 0) {
				for (const request of state.requests) {
					this.socket?.emit("request-live-updates", request.deviceId, [request.type], (ack: any) => {
						console.log("Ack for request:", request, ":", ack);
					});
				}
				this.store?.emptyRequests();
			}
		});
	}

	waitForDeviceURL(): Promise<string> {
		return new Promise((resolve) => {
			const store = useDevicesStore();
			const userStore = useUserStore();
			const interval = setInterval(() => {
				if (store.devices?.api && userStore.accessToken && !userStore.isLoading) {
					clearInterval(interval);
					resolve(store.devices.api);
				}
			}, 750);
		});
	}

	disconnect() {
		console.log("Disconnecting");
		if (this.socket) {
			this.socket.disconnect();
		}
	}

	onConnected(callback: () => void) {
		this.on("connect", callback);
	}

	onNewDevice(callback: (deviceId: string) => void) {
		this.on("new-device", callback);
	}

	private on(event: string, callback: (...args: any[]) => void) {
		this.socket?.on(event, callback);
	}
}

export default new SocketService();
