import type { IterableElement } from "@xeho91/lib-type/iterable";

export const ICONS_MAP = new Map([
	["copy", "copy-simple"],
	["check", "check-fat"],
	["close", "x"],
	["desktop", "desktop"],
	["discord", "discord-logo"],
	["error", "warning-octagon"],
	["github", "github-logo"],
	["heart", "heart"],
	["info", "info"],
	["legal", "scales"],
	["linkedin", "linkedin-logo"],
	["email", "envelope-simple"],
	["matrix", "matrix-logo"],
	["mobile", "device-mobile"],
	["moon", "moon"],
	["monitor", "monitor"],
	["placeholder", "placeholder"],
	["settings", "gear"],
	["shield", "shield-star"],
	["success", "check-circle"],
	["sun", "sun"],
	["tablet", "device-tablet"],
	["warning", "warning"],
	["twitter", "twitter-logo"],
] as const);

export type IconEntry = IterableElement<typeof ICONS_MAP>;
export type IconName = IconEntry[0];
export type IconifyName = IconEntry[1];
