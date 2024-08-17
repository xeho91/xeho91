import type { IterableElement } from "@xeho91/lib-type/iterable";

export const ICONS_MAP = new Map([
	["copy", "copy-simple"],
	["check", "check-fat"],
	["close", "x"],
	["desktop", "desktop"],
	["error", "warning-octagon"],
	["heart", "heart"],
	["info", "info"],
	["legal", "scales"],
	["mobile", "device-mobile"],
	["placeholder", "placeholder"],
	["settings", "gear"],
	["shield", "shield-star"],
	["success", "check-circle"],
	["tablet", "device-tablet"],
	["warning", "warning"],
] as const);

export type IconEntry = IterableElement<typeof ICONS_MAP>;
export type IconName = IconEntry[0];
export type IconifyName = IconEntry[1];
