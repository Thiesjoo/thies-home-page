import { ValidComponentNames } from "@/components/widgets";

export type ValidLocation = "topleft" | "bottomleft" | "topright" | "bottomright";
export const ALL_LOCATIONS: ValidLocation[] = ["topleft", "bottomleft", "topright", "bottomright"];

export type Widget = {
	name: ValidComponentNames;
	id: string;
};

export type User = {
	name: {
		first: string;
		last: string;
	};
	email: string;
	settings: {
		backgroundURL: string;
		showSeconds: boolean;
		showDate: boolean;
		showVersion: boolean;
		showFavorites: boolean;
		favorites: { name: string; url: string }[];
		widgets: { [key in ValidLocation]: Widget[] };
		widgetsAvailable: Widget[];
	};
};

// Make a copy of the User type, but exclude some settings like widgets, favorites, etc.
export type UserFromAPI = Omit<User, "settings"> & {
	settings: Omit<User["settings"], "widgets" | "favorites" | "widgetsAvailable">;
};
