import { useDevicesStore } from "@/store/device.store";
import { io, Socket } from "socket.io-client";

class SocketService {
	socket?: Socket;
	store?: ReturnType<typeof useDevicesStore>;
	constructor() {}

	async setupSocketConnection() {
		const store = useDevicesStore();
		this.store = store;
		const url = await this.waitForDeviceURL();
		this.socket = io(url);

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
		this.socket?.on("initial-data", console.log);
		this.socket?.on("cpu-load", console.log);
	}

	registerStoreEvents() {
		// Check if we want new data
		this.store?.$subscribe((mut, state) => {
			if (state.requests.length > 0) {
				for (const request of state.requests) {
					console.log("Should emit this: ", request);
					this.socket?.emit("request-live-updates", request.deviceId, [request.type], (ack: any) => {
						console.log("ACK: ", ack);
					});
				}
				this.store?.emptyRequests();
			}
		});
	}

	waitForDeviceURL(): Promise<string> {
		return new Promise((resolve) => {
			const store = useDevicesStore();
			const interval = setInterval(() => {
				if (store.devices?.api) {
					clearInterval(interval);
					resolve(store.devices.api);
				}
			}, 750);
		});
	}

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
		}
	}
}

export default new SocketService();
