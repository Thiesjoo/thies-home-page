import { getDeviceBaseURL } from "@/helpers/auto-refresh-tokens";
import { LiveData } from "@/helpers/types/pusher.types";
import { useDevicesStore } from "@/store/device.store";
import { useUserStore } from "@/store/user.store";
import { io, Socket } from "socket.io-client";

class SocketService {
	socket?: Socket;
	store?: ReturnType<typeof useDevicesStore>;

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

		store.socket.connecting = true;
		store.socket.error = "";
		this.registerInstantEvents();

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

		this.socket.on("exception", (error: any) => {
			console.error("Socket exception: ", error);
		});

		this.registerSocketEvents();
		this.registerStoreEvents();
	}

	registerSocketEvents() {
		if (!this.store) {
			console.error("Store not initialized, but it is needed for socket events");
			return;
		}

		this.socket?.on("initial-data", console.log);
		this.socket?.onAny((event, ...args) => {
			if (event.endsWith("-load")) {
				console.log("Got event: ", event, args);

				if (!this.store) {
					console.error("Store not initialized, but it is needed for socket events");
					return;
				}

				const [data] = args as [
					{ type: keyof LiveData; data: any; dateReceived: number; userID: string; deviceID: string }
				];
				this.store.updateLoad(data.deviceID, data.type, data.data, data.dateReceived);
			}
		});
	}

	// TODO: Persist this data in the class somewhere to re-send it on reconnect
	registerStoreEvents() {
		// Check if we want new data
		this.store?.$subscribe((mut, state) => {
			if (state.requests.length > 0 && !state.loading.userdata) {
				for (const request of state.requests) {
					this.socket?.emit(
						"request-live-updates",
						{ deviceID: request.deviceID, properties: request.type },
						(ack: any) => {
							console.log("Ack for request:", request, ":", ack);
						}
					);
				}
				this.store?.emptyRequests();
			}
		});
	}

	registerInstantEvents() {
		this.onConnected(() => {
			this.socket?.emit("request-new-devices", (ack: any) => {
				console.log("Result from new device request:", ack);
			});
		});
	}

	waitForDeviceURL(): Promise<string> {
		return new Promise((resolve) => {
			const store = useDevicesStore();
			const userStore = useUserStore();
			const interval = setInterval(() => {
				if (!store.loading.userdata && userStore.accessToken && !userStore.isLoading) {
					clearInterval(interval);
					resolve(getDeviceBaseURL());
				}
			}, 750);
		});
	}

	disconnect() {
		if (this.socket) {
			console.log("Disconnecting");
			this.socket.disconnect();
		}
	}

	onConnected(callback: () => void) {
		this.on("connect", callback);
	}

	onNewDevice(callback: (payload: { deviceID: string; userID: string }) => void) {
		this.on("new-device", callback);
	}

	private on(event: string, callback: (...args: any[]) => void) {
		this.socket?.on(event, callback);
	}
}

export default new SocketService();
