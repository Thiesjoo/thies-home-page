/**
 * Make a color lighter or darker
 * @param color A hex color string starting with #
 * @param percent
 * @returns
 */
export function lightenDarkenColor(color: string, percent: number): string {
	return (
		"#" +
		[1, 3, 5]
			.map((x) => {
				let temp = parseInt(color.substring(x, x + 2), 16);
				temp = ~~((temp * (100 + percent)) / 100);
				temp = Math.min(temp, 255);
				return temp.toString(16).padStart(2, "0");
			})
			.join("")
	);
}

/**
 * Creates a hex color from every string
 *
 * Source: https://stackoverflow.com/a/16348977
 * @param str
 * @returns
 */
export function colorFromString(str: string) {
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	var color = "#";
	for (var i = 0; i < 3; i++) {
		var value = (hash >> (i * 8)) & 0xff;
		color += ("00" + value.toString(16)).substr(-2);
	}
	return color;
}
