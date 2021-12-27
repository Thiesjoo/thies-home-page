/**
 * Change the favoicon to a PNG
 * @param {*} src The link to the PNG image
 */
export function changeFavicon(src: string) {
	const link = document.createElement("link");
	const oldLink = document.getElementById("dynamic-favicon");

	link.id = "dynamic-favicon";
	link.rel = "shortcut icon";
	link.href = src;
	link.type = "image/png";
	if (oldLink) {
		document.head.removeChild(oldLink);
	}

	document.head.appendChild(link);
}
