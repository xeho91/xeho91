import type { Color, ColorScheme } from "@xeho91/lib-color/instance";
import { PALETTE_SECONDARY } from "@xeho91/lib-color/palette/brand/secondary";
import { PALETTE_GRAY } from "@xeho91/lib-color/palette/grayscale/gray";
import { unrecognized } from "@xeho91/lib-error/unrecognized";
import type { IterableElement } from "type-fest/source/iterable-element";

import { set_id } from "#id";

export type BrandAssetThemeName = IterableElement<typeof BrandAssetTheme.NAMES>;
export class BrandAssetTheme<TName extends BrandAssetThemeName = BrandAssetThemeName> {
	static readonly #NAMES = ["color", "black", "white"] as const;
	public static readonly NAMES = Object.freeze(new Set(BrandAssetTheme.#NAMES));

	public static readonly DEFAULT = "color" satisfies BrandAssetThemeName;

	public static [Symbol.iterator](): IterableIterator<BrandAssetThemeName> {
		return BrandAssetTheme.#NAMES[Symbol.iterator]();
	}

	readonly #name: TName;

	constructor(name: TName) {
		this.#name = name;
	}

	public get_color_foreground<TScheme extends ColorScheme>(scheme: TScheme): Color | undefined {
		// biome-ignore format: Prettier
		/* prettier-ignore */
		switch (this.#name) {
			case "color": return;
			case "black": return PALETTE_GRAY.solid(scheme, 12);
			case "white": return PALETTE_GRAY.solid(scheme, 1);
		}
	}

	public get light_foreground(): ReturnType<typeof this.get_color_foreground<"light">> {
		return this.get_color_foreground("light");
	}

	public get dark_foreground(): ReturnType<typeof this.get_color_foreground<"dark">> {
		return this.get_color_foreground("dark");
	}

	public get_fill_foreground(id: string): string {
		// biome-ignore format: Prettier
		/* prettier-ignore */
		switch (this.#name) {
			case "color": return `url(#${set_id(id, "gradient")})`;
			case "black":
			case "white": return "light-dark(var(--light), var(--dark))";
			default: throw unrecognized(this.#name);
		}
	}

	public get_color_background<TScheme extends ColorScheme>(scheme: TScheme): Color {
		// biome-ignore format: Prettier
		/* prettier-ignore */
		switch (this.#name) {
			case "color": return PALETTE_SECONDARY.blend(scheme, 2);
			case "black": return PALETTE_GRAY.blend(scheme, 2);
			case "white": return PALETTE_GRAY.blend(scheme, 9);
			default: throw unrecognized(this.#name);
		}
	}

	public get light_background(): ReturnType<typeof this.get_color_background<"light">> {
		return this.get_color_background("light");
	}

	public get dark_background(): ReturnType<typeof this.get_color_background<"dark">> {
		return this.get_color_background("dark");
	}
}
