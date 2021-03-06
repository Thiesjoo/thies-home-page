import { useUserStore, Widget } from "@/store/user.store";

export function generateKey(a: Widget): string {
	return a.name + a.id;
}

export function makeUnique(a: Widget[], filterOnExisting = false): Widget[] {
	let alreadyFound = new Set<string>();

	if (filterOnExisting) {
		const userStore = useUserStore();
		if (userStore.user) {
			const entries = Object.entries(userStore.user.settings.widgets);
			entries.forEach((x) => {
				x[1].forEach((y) => {
					alreadyFound.add(generateKey(y));
				});
			});
		}
	}

	return a.filter((x) => {
		if (alreadyFound.has(generateKey(x))) {
			return false;
		}

		alreadyFound.add(generateKey(x));
		return true;
	});
}
