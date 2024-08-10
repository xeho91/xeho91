import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import type { AtomicColor } from "#atomic";
import { LightDark } from "#light-dark";
import * as accent from "#palette/brand/accent";
import * as primary from "#palette/brand/primary";
import * as secondary from "#palette/brand/secondary";
import * as black from "#palette/grayscale/black";
import * as gray from "#palette/grayscale/gray";
import * as white from "#palette/grayscale/white";
import * as error from "#palette/semantic/error";
import * as info from "#palette/semantic/info";
import * as success from "#palette/semantic/success";
import * as warning from "#palette/semantic/warning";

const VARIABLE = readonly_object({
	brand: {
		accent,
		primary,
		secondary,
	},
	grayscale: {
		black,
		gray,
		white,
	},
	semantic: {
		error,
		info,
		success,
		warning,
	},
});

export type ColorBrandName = IterableElement<typeof ColorBrand.NAMES>;

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative?
export class ColorBrand {
	public static readonly NAMES = readonly_set(object_keys(VARIABLE.brand));

	public static [Symbol.iterator](): IterableIterator<ColorBrandName> {
		return ColorBrand.NAMES[Symbol.iterator]();
	}
}

export type ColorGrayscaleName = IterableElement<typeof ColorGrayscale.NAMES>;

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative?
export class ColorGrayscale {
	public static readonly NAMES = readonly_set(object_keys(VARIABLE.grayscale));

	public static [Symbol.iterator](): IterableIterator<ColorGrayscaleName> {
		return ColorGrayscale.NAMES[Symbol.iterator]();
	}
}

export type ColorSemanticName = IterableElement<typeof ColorSemantic.NAMES>;

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative?
export class ColorSemantic {
	public static readonly NAMES = readonly_set(object_keys(VARIABLE.semantic));

	public static [Symbol.iterator](): IterableIterator<ColorSemanticName> {
		return ColorSemantic.NAMES[Symbol.iterator]();
	}
}

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative?
export class Color {
	public static brand = ColorBrand;
	public static grayscale = ColorGrayscale;
	public static semantic = ColorSemantic;

	/**
	 * Supported color schemes set.
	 * @see {@link https://drafts.csswg.org/css-color-adjust/#color-scheme-prop}
	 */
	public static readonly SCHEMES = readonly_set(["light", "dark"]);

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
	public static readonly STEPS = readonly_set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

	/**
	 * Available color categories set, for grouping purposes.
	 */
	public static readonly CATEGORIES = readonly_set(["brand", "semantic", "grayscale"]);

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
	public static readonly TYPES = readonly_set(["solid", "blend"]);

	public static readonly NAMES = readonly_set([
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
	]);

	static #variable_identifier = <
		TName extends ColorName,
		TType extends ColorType,
		TStep extends ColorStep,
		TScheme extends ColorScheme,
	>(
		name: TName,
		type: TType,
		step: TStep,
		scheme: TScheme,
	): VariableIdentifier<TName, TType, TStep, TScheme> =>
		`${name.toUpperCase()}_${type.toUpperCase() as Uppercase<TType>}_${step}_${scheme.toUpperCase()}` as VariableIdentifier<
			TName,
			TType,
			TStep,
			TScheme
		>;

	static #get_identifiers<TCategory extends ColorCategory, TName extends ColorName>(
		category: TCategory,
		name: TName,
	): IdentifiersByCategory<TCategory, TName> {
		const by_category = VARIABLE[category as keyof typeof VARIABLE];
		return by_category[name as keyof typeof by_category];
	}

	public static get = <
		TCategory extends ColorCategory,
		TName extends ColorName,
		TType extends ColorType = "blend",
		TStep extends ColorStep = 8,
	>(
		category: TCategory,
		name: TName,
		type = "blend" as TType,
		step = 8 as TStep,
	): LightDark<
		"brand",
		TName extends ColorName ? TName : never,
		TType,
		TStep,
		ImportedColor<TCategory, TName extends ColorName ? TName : never, TType, TStep, "light">,
		ImportedColor<TCategory, TName extends ColorName ? TName : never, TType, TStep, "dark">
	> => {
		const by_category_and_name = Color.#get_identifiers(category, name as ColorName);
		const light = by_category_and_name[
			Color.#variable_identifier(name as ColorName, type, step, "light") as keyof typeof by_category_and_name
		] as AtomicColor;
		const dark = by_category_and_name[
			Color.#variable_identifier(name as ColorName, type, step, "dark") as keyof typeof by_category_and_name
		] as AtomicColor;
		return new LightDark({ category: "brand", name: name as ColorName, type, step, light, dark }) as LightDark<
			"brand",
			TName extends ColorName ? TName : never,
			TType,
			TStep,
			ImportedColor<TCategory, TName extends ColorName ? TName : never, TType, TStep, "light">,
			ImportedColor<TCategory, TName extends ColorName ? TName : never, TType, TStep, "dark">
		>;
	};
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
 * @see {@link Color.TYPES}
 */
export type ColorType = IterableElement<typeof Color.TYPES>;

/**
 * @see {@link Color.STEPS}
 */
export type ColorStep = IterableElement<typeof Color.STEPS>;

type VariableIdentifier<
	TName extends ColorName,
	TType extends ColorType,
	TStep extends ColorStep,
	TScheme extends ColorScheme,
> = `${Uppercase<TName>}_${Uppercase<TType>}_${TStep}_${Uppercase<TScheme>}`;

type IdentifiersByCategory<
	TCategory extends ColorCategory,
	TName extends ColorName,
> = TName extends keyof (typeof VARIABLE)[TCategory] ? (typeof VARIABLE)[TCategory][TName] : never;

type ImportedColor<
	TCategory extends ColorCategory,
	TName extends ColorName,
	TType extends ColorType,
	TStep extends ColorStep,
	TScheme extends ColorScheme,
> = VariableIdentifier<TName, TType, TStep, TScheme> extends keyof IdentifiersByCategory<TCategory, TName>
	? IdentifiersByCategory<TCategory, TName>[VariableIdentifier<TName, TType, TStep, TScheme>] extends AtomicColor
		? IdentifiersByCategory<TCategory, TName>[VariableIdentifier<TName, TType, TStep, TScheme>]
		: never
	: never;

export type ColorCategoryFromName<TName extends ColorName> = TName extends "primary" | "secondary" | "accent"
	? "brand"
	: TName extends "error" | "info" | "success" | "warning"
		? "semantic"
		: TName extends "black" | "gray" | "white"
			? "grayscale"
			: never;
