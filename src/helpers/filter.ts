export function filterArrayBasedOnType<T, K>(
	arr: { type: T; name: K }[],
	type: T
): K[] {
	return arr.filter((x) => x.type === type).map((x) => x.name);
}
