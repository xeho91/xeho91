import type { SelectorClass } from "@xeho91/lib-css/selector/class";
import { Color } from "@xeho91/lib-design/color";
import type { FontSizeKey } from "@xeho91/lib-design/font/size";
import { Radius } from "@xeho91/lib-design/radius";
import { Space } from "@xeho91/lib-design/space";
import { unrecognized } from "@xeho91/lib-error/unrecognized";
import { exclude_set, readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import type { TextColor } from "#primitive/text/mod";

export const BUTTON_TAGS = readonly_set(["a", "button"]);
export type ButtonTag = IterableElement<typeof BUTTON_TAGS>;

export const BUTTON_COLORS = exclude_set(Color.NAMES, ["gray", "white", "black"]);
export type ButtonColor = IterableElement<typeof BUTTON_COLORS>;

export const BUTTON_SIZES = readonly_set(["small", "medium", "large"]);
export type ButtonSize = IterableElement<typeof BUTTON_SIZES>;

export const BUTTON_VARIANTS = readonly_set(["filled", "outlined", "transparent"]);
export type ButtonVariant = IterableElement<typeof BUTTON_VARIANTS>;

export function set_button_size_class_names<Size extends ButtonSize>(size: Size, is_icon: boolean): SelectorClass[] {
	// biome-ignore format: Prettier
	switch (size) {
		case "small": return [
			Space.get(is_icon ? "2xs" : "s").class("padding-inline"),
			Space.get("2xs").class("padding-block"),
			Radius.get(is_icon ? "circle" : "s").class(),
		] as const;
		case "medium": return [
			Space.get(is_icon ? "xs" : "m").class("padding-inline"),
			Space.get("xs").class("padding-block"),
			Radius.get(is_icon ? "circle" : "m").class(),
		] as const;
		case "large": return [
			Space.get(is_icon ? "s" : "l").class("padding-inline"),
			Space.get("s").class("padding-block"),
			Radius.get(is_icon ? "circle" : "l").class(),
		] as const;
		default: throw unrecognized(size);
	}
}

export function set_button_color_class_names<Variant extends ButtonVariant, Color extends ButtonColor>(
	variant: Variant,
	color: Color,
): SelectorClass[] {
	// biome-ignore format: Prettier
	switch (variant) {
		case "filled": return [
			Color.get(color, "solid", 9).class("background"),
			Color.get(color, "solid", 10).class("background", { pseudo_class: "active" }),
			Color.get(color, "solid", 10).class("background", { pseudo_class: "focus" }),
			Color.get(color, "solid", 10).class("background", { pseudo_class: "hover" }),
			Color.get(color, "solid", 9).class("border"),
			Color.get(color, "solid", 10).class("border", { pseudo_class: "focus-within" }),
			Color.get(color, "blend", 9).class("box-shadow"),
		];
		case "outlined": return [
			Color.get(color, "solid", 3).class("background"),
			Color.get(color, "solid", 5).class("background", { pseudo_class: "active" }),
			Color.get(color, "solid", 5).class("background", { pseudo_class: "focus" }),
			Color.get(color, "solid", 4).class("background", { pseudo_class: "hover" }),
			Color.get(color, "solid", 7).class("border"),
			Color.get(color, "solid", 8).class("border", { pseudo_class: "focus-within" }),
			Color.get(color, "blend", 9).class("box-shadow"),
		];
		case "transparent": return [
			Color.get(color, "blend", 5).class("background", { pseudo_class: "active" }),
			Color.get(color, "blend", 5).class("background", { pseudo_class: "focus" }),
			Color.get(color, "blend", 4).class("background", { pseudo_class: "hover" }),
			Color.get(color, "solid", 7).class("border"),
			Color.get(color, "solid", 8).class("border", { pseudo_class: "focus-within" }),
			Color.get(color, "blend", 9).class("box-shadow"),
		];
		default: throw unrecognized(variant);
	}
}

export function set_button_text_color<TVariant extends ButtonVariant, TColor extends ButtonColor>(
	variant: TVariant,
	color: TColor,
): TextColor {
	// biome-ignore format: Prettier
	switch (variant) {
		case "filled": return color === "warning" ? "black" : "white";
		case "outlined": return color;
		case "transparent": return color;
		default: throw unrecognized(variant);
	}
}

export function set_button_text_size<TSize extends ButtonSize>(size: TSize, is_icon: boolean): FontSizeKey {
	// biome-ignore format: Prettier
	switch (size) {
		case "small": return is_icon ? "m" : "s";
		case "medium": return is_icon ? "l" : "m";
		case "large": return "xl";
		default: throw unrecognized(size);
	}
}
