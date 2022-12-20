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
