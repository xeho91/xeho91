import type { AtomicColor } from "@xeho91/lib-color/atomic";
import { LightDark } from "@xeho91/lib-css/function/light-dark";
import { Reference } from "@xeho91/lib-css/reference";
import { Color, type ColorScheme } from "@xeho91/lib-design/color";
import { unrecognized } from "@xeho91/lib-error/unrecognized";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { set_id } from "#id";

export type BrandAssetThemeName = IterableElement<typeof BrandAssetTheme.NAMES>;

export class BrandAssetTheme<TName extends BrandAssetThemeName = BrandAssetThemeName> {
	public static readonly NAMES = readonly_set([
		//
		"color",
		"black",
		"white",
	]);

	public static [Symbol.iterator](): IterableIterator<BrandAssetThemeName> {
		return BrandAssetTheme.NAMES[Symbol.iterator]();
	}

	public static readonly DEFAULT = "color" satisfies BrandAssetThemeName;

	readonly #name: TName;

	constructor(name: TName) {
		this.#name = name;
	}

	public foreground_color<TScheme extends ColorScheme>(scheme: TScheme): AtomicColor | undefined {
		// biome-ignore format: Prettier
		switch (this.#name) {
			case "color": return;
			case "black": return Color.get("grayscale", "gray", "opaque", 12)[scheme];
			case "white": return Color.get("grayscale", "gray", "opaque", 1)[scheme];
		}
	}

	// TODO: Use css lib - when created `url` function
	public fill_foreground(id: string): LightDark | string {
		const name = this.#name;
		// biome-ignore format: Prettier
		switch (name) {
			// TODO: Use css lib - when created `url` function
			case "color": return `url(#${set_id(id, "gradient")})`;
			case "black":
			case "white": return new LightDark(
				new Reference("light").to_var().to_value(),
				new Reference("dark").to_var().to_value(),
			);
			default: throw unrecognized(name);
		}
	}

	public background_color<TScheme extends ColorScheme>(scheme: TScheme): AtomicColor {
		const name = this.#name;
		// biome-ignore format: Prettier
		switch (name) {
			case "color": return Color.get("brand", "secondary", "blend", 2)[scheme];
			case "black": return Color.get("grayscale", "gray", "blend", 2)[scheme];
			case "white": return Color.get("grayscale", "gray", "blend", 9)[scheme];
			default: throw unrecognized(name);
		}
	}
}
