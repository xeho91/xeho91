import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import * as accent from "#color/palette/brand/accent";
import * as primary from "#color/palette/brand/primary";
import * as secondary from "#color/palette/brand/secondary";
import * as black from "#color/palette/grayscale/black";
import * as gray from "#color/palette/grayscale/gray";
import * as white from "#color/palette/grayscale/white";
import * as error from "#color/palette/semantic/error";
import * as info from "#color/palette/semantic/info";
import * as success from "#color/palette/semantic/success";
import * as warning from "#color/palette/semantic/warning";
import type { AtomicColor } from "./atomic";

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
	): {
		light: AtomicColor<TCategory, TName, TType, TStep, "light">;
		dark: AtomicColor<TCategory, TName, TType, TStep, "dark">;
	} => {
		const by_category_and_name = Color.#get_identifiers(category, name as ColorName);
		const light = by_category_and_name[
			Color.#variable_identifier(name as ColorName, type, step, "light") as keyof typeof by_category_and_name
		] as AtomicColor<TCategory, TName, TType, TStep, "light">;
		const dark = by_category_and_name[
			Color.#variable_identifier(name as ColorName, type, step, "dark") as keyof typeof by_category_and_name
		] as AtomicColor<TCategory, TName, TType, TStep, "dark">;
		return { light, dark };
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

export type ColorCategoryFromName<TName extends ColorName> = TName extends "primary" | "secondary" | "accent"
	? "brand"
	: TName extends "error" | "info" | "success" | "warning"
		? "semantic"
		: TName extends "black" | "gray" | "white"
			? "grayscale"
			: never;
