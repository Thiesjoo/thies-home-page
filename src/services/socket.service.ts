import { GlobalLoad } from "@/helpers/types/pusher.types";
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
		// Append auth token as a query parameter
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
		this.socket?.on("initial-data", console.log);
		this.socket?.onAny((event, ...args) => {
			if (event.endsWith("-load")) {
				console.log("Got event: ", event, args);
			}
			if (event === "global-load") {
				const [data] = args as [GlobalLoad & { deviceId: string }];
				const id = data.deviceId;

				this.store?.updateDevice(id, data);

				return;
			}
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
			const interval = setInterval(() => {
				if (store.devices?.api) {
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
}

export default new SocketService();
