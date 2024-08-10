import { Color, type ColorName } from "@xeho91/lib-design/color";
import { exclude_set, readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const SKELETON_VARIANTS = readonly_set(["circle", "rect", "text"]);
export type SkeletonVariant = IterableElement<typeof SKELETON_VARIANTS>;

export const SKELETON_COLORS = exclude_set(Color.NAMES, ["black", "white"]);
export type SkeletonColor = IterableElement<typeof SKELETON_COLORS>;

const is_valid_skeleton_color = (name: ColorName): name is SkeletonColor => SKELETON_COLORS.has(name);

export function set_skeleton_color<TName extends ColorName | undefined>(name: TName): SkeletonColor {
	if (name && is_valid_skeleton_color(name)) return name;
	return "gray";
}
