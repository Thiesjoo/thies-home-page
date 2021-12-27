/**
 * Change the favoicon to a PNG
 * @param {*} src The link to the PNG image
 */
export function changeFavicon(src: string) {
	const existing = document.getElementById("favoicon");
	if (existing) {
		existing.setAttribute("href", src);
		return;
	}

	const oldLink = document.getElementById("dynamic-favicon");
	if (oldLink) {
		document.head.removeChild(oldLink);
	}

	// Create a new one
	const link = document.createElement("link");
	link.id = "dynamic-favicon";
	link.rel = "icon";
	link.href = src;
	link.type = "image/png";

	document.head.appendChild(link);
}
