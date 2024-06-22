/**
 * Color instance.
 * @module
 */

import type { KeyValueStruct } from "@xeho91/lib-type/struct";
import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import type { Oklch as CuloriOklch } from "culori/fn";
import type { IterableElement } from "type-fest/source/iterable-element";

import type { ColorOklch } from "#oklch";

export class Color<
	const TCategory extends ColorCategory = ColorCategory,
	const TName extends ColorName = ColorName,
	const TType extends ColorType = ColorType,
	const TScheme extends ColorScheme = ColorScheme,
	const TStep extends ColorStep = ColorStep,
	const TOklch extends ColorOklch = ColorOklch,
> implements KeyValueStruct<TName, ToString<TOklch>>, Display<TName>
{
	static readonly #SCHEMES = ["light", "dark"] as const;
	/**
	 * Supported color schemes set.
	 * @see {@link https://drafts.csswg.org/css-color-adjust/#color-scheme-prop}
	 */
	public static readonly SCHEMES = Object.freeze(new Set(Color.#SCHEMES));

	static readonly #STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
	/**
	 * Color steps set.
	 * **There are 12 steps in each scale**.
	 * Each step was designed for at least one specific use case.
	 * This table is a simple overview of the most common use case for each step.
	 *
	 * | Step | Use Case                                |
	 * | ---- | --------------------------------------- |
	 * | 1    | App background                          |
	 * | 2    | Subtle background                       |
	 * | 3    | UI element background                   |
	 * | 4    | Hovered UI element background           |
	 * | 5    | Active / Selected UI element background |
	 * | 6    | Subtle borders and separators           |
	 * | 7    | UI element border and focus rings       |
	 * | 8    | Hovered UI element border               |
	 * | 9    | Solid backgrounds                       |
	 * | 10   | Hovered solid backgrounds               |
	 * | 11   | Low-contrast text                       |
	 * | 12   | High-contrast text                      |
	 *
	 * @see {@link https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale#use-cases}
	 */
	public static readonly STEPS = Object.freeze(new Set(Color.#STEPS));

	static readonly #CATEGORIES = ["brand", "semantic", "grayscale"] as const;
	/**
	 * Available color categories set, for grouping purposes.
	 */
	public static readonly CATEGORIES = Object.freeze(new Set(Color.#CATEGORIES));

	static readonly #TYPES = ["solid", "blend"] as const;
	/**
	 * The idea is that the solid and blend scales are interchangeable, since they match almost perfectly.
	 * Sometimes you need a color to be transparent, so it works well on coloured backgrounds for example.
	 * Let's say you have a text field with a light gray border,
	 *
	 * we'll use Mauve for this example.
	 * You use step mauve7 here for the border.
	 * That border will work well on a white background in light mode, or a dark background in dark mode.
	 * But the border won't look great on a purple background for example.
	 * So you can use mauveA7, which is transparent.
	 * Now your text field border will work well on any background because it blends in,
	 * but it still looks the same as mauve7 on white/dark backgrounds.
	 *
	 * Sometimes you need opaque colors, sometimes transparent. Now you have the option.
	 *
	 * @see {@link https://github.com/radix-ui/colors/issues/9#issuecomment-876643069}
	 */
	public static readonly TYPES = Object.freeze(new Set(Color.#TYPES));

	static readonly #NAMES = [
		"primary",
		"secondary",
		"accent",
		"error",
		"info",
		"success",
		"warning",
		"black",
		"gray",
		"white",
	] as const;
	public static readonly NAMES = Object.freeze(new Set(Color.#NAMES));

	/**
	 * @see {@link Color.CATEGORIES}
	 */
	public readonly category: TCategory;
	/**
	 * @see {@link Color.NAMES}
	 */
	public readonly name: TName;
	/**
	 * @see {@link Color.SCHEMES}
	 */
	public readonly scheme: TScheme;
	/**
	 * @see {@link Color.TYPES}
	 */
	public readonly type: TType;
	/**
	 * @see {@link Color.STEPS}
	 */
	public readonly step: TStep;
	/**
	 * @see {@link ColorOklch}
	 */
	public readonly oklch: TOklch;

	constructor({
		category,
		name,
		scheme,
		type: type_,
		step,
		oklch,
	}: {
		category: TCategory;
		name: TName;
		scheme: TScheme;
		type: TType;
		step: TStep;
		oklch: TOklch;
	}) {
		this.category = category;
		this.name = name;
		this.scheme = scheme;
		this.type = type_;
		this.step = step;
		this.oklch = oklch;
	}

	public valueOf(): ToString<TOklch> {
		return this.oklch.toString() as ToString<TOklch>;
	}

	public toString(): TName {
		return this.name;
	}

	public get culori_oklch(): CuloriOklch {
		return {
			mode: "oklch",
			l: this.oklch.lightness.valueOf(),
			c: this.oklch.chroma.valueOf(),
			h: this.oklch.hue.valueOf(),
			alpha: this.oklch.alpha.valueOf(),
		};
	}
}

/**
 * @see {@link Color.CATEGORIES}
 */
export type ColorCategory = IterableElement<typeof Color.CATEGORIES>;

/**
 * @see {@link Color.NAMES}
 */
export type ColorName = IterableElement<typeof Color.NAMES>;

/**
 * @see {@link Color.SCHEMES}
 */
export type ColorScheme = IterableElement<typeof Color.SCHEMES>;

/**
 * @see {@link Color.SCHEMES}
 */
export type ColorType = IterableElement<typeof Color.TYPES>;

/**
 * @see {@link Color.STEPS}
 */
export type ColorStep = IterableElement<typeof Color.STEPS>;
