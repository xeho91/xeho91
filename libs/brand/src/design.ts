import { Color, type ColorScheme } from "@xeho91/lib-color";
import type { AtomicColor } from "@xeho91/lib-color/atomic";
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

	public get_color_foreground<TScheme extends ColorScheme>(scheme: TScheme): AtomicColor | undefined {
		// biome-ignore format: Prettier
		switch (this.#name) {
			case "color": return;
			case "black": return Color.get("grayscale", "gray", "solid", 12)[scheme];
			case "white": return Color.get("grayscale", "gray", "solid", 1)[scheme];
		}
	}

	public get light_foreground(): ReturnType<typeof this.get_color_foreground<"light">> {
		return this.get_color_foreground("light");
	}

	public get dark_foreground(): ReturnType<typeof this.get_color_foreground<"dark">> {
		return this.get_color_foreground("dark");
	}

	public get_fill_foreground(id: string): string {
		const name = this.#name;
		// biome-ignore format: Prettier
		switch (name) {
			case "color": return `url(#${set_id(id, "gradient")})`;
			case "black":
			case "white": return "light-dark(var(--light), var(--dark))";
			default: throw unrecognized(name);
		}
	}

	public get_color_background<TScheme extends ColorScheme>(scheme: TScheme): AtomicColor {
		const name = this.#name;
		// biome-ignore format: Prettier
		switch (name) {
			case "color": return Color.get("brand", "secondary", "blend", 2)[scheme];
			case "black": return Color.get("grayscale", "gray", "blend", 2)[scheme];
			case "white": return Color.get("grayscale", "gray", "blend", 9)[scheme];
			default: throw unrecognized(name);
		}
	}

	public get light_background(): ReturnType<typeof this.get_color_background<"light">> {
		return this.get_color_background("light");
	}

	public get dark_background(): ReturnType<typeof this.get_color_background<"dark">> {
		return this.get_color_background("dark");
	}
}
