import { ComponentPublicInstance } from "vue";

let failedComponents: any[] = [];

export default function errorCaptured(err: unknown, instance: ComponentPublicInstance | null, info: string) {
	if ((err as any)?.message?.startsWith("SAFE - ")) {
		console.log("Component soft failed: ", (err as any).message, instance);
		return false;
	}

	failedComponents.push(instance);
	console.error(err);
	console.warn(failedComponents.length, "components failed to load");
	return false;
}
