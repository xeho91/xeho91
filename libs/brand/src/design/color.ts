import {
	type ColorCategory,
	type ColorCategoryFromName,
	type ColorName,
	type ColorScheme,
	type ColorStep,
	type ColorType,
	DesignColor,
} from "@xeho91/lib-design/color";
import type { AtomicColor } from "@xeho91/lib-design/color/atomic";
import { DesignToken } from "@xeho91/lib-design/token";
import { readonly_object } from "@xeho91/lib-snippet/object";

import * as accent from "./color/brand/accent";
import * as primary from "./color/brand/primary";
import * as secondary from "./color/brand/secondary";
import * as black from "./color/grayscale/black";
import * as gray from "./color/grayscale/gray";
import * as white from "./color/grayscale/white";
import * as error from "./color/semantic/error";
import * as info from "./color/semantic/info";
import * as success from "./color/semantic/success";
import * as warning from "./color/semantic/warning";

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

export class Color<
	TCategory extends ColorCategory = ColorCategory,
	TName extends ColorName = ColorName,
	TType extends ColorType = ColorType,
	TStep extends ColorStep = ColorStep,
> extends DesignColor<TCategory, TName, TType, TStep> {
	static #get_by_scheme = <
		TCategory extends ColorCategory,
		TName extends ColorName,
		TType extends ColorType,
		TStep extends ColorStep,
		TScheme extends ColorScheme,
	>(
		category: TCategory,
		name: TName,
		type: TType,
		step: TStep,
		scheme: TScheme,
	): AtomicColor<TCategory, TName, TType, TStep, TScheme> => {
		const by_category_and_name = Color.#get_identifiers(category, name as ColorName);
		return by_category_and_name[
			Color.#variable_identifier(name as ColorName, type, step, scheme) as keyof typeof by_category_and_name
		] as AtomicColor<TCategory, TName, TType, TStep, TScheme>;
	};

	static #get_identifiers<TCategory extends ColorCategory, TName extends ColorName>(
		category: TCategory,
		name: TName,
	): IdentifiersByCategory<TCategory, TName> {
		const by_category = VARIABLE[category as keyof typeof VARIABLE];
		return by_category[name as keyof typeof by_category];
	}

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

	public static get = <TName extends ColorName, TType extends ColorType = "opaque", TStep extends ColorStep = 8>(
		name: TName,
		type = "opaque" as TType,
		step = 8 as TStep,
	): Color<ColorCategoryFromName<TName>, TName, TType, TStep> => {
		const category = DesignColor.get_category_from_name(name);
		const variant = DesignColor.create_variant(category, name, type, step);
		const cached = DesignToken.CONSTRUCTED.get(`${DesignColor.NAME}-${variant}`);
		if (cached) return cached as Color<ColorCategoryFromName<TName>, TName, TType, TStep>;
		return new Color({ category, name, type, step });
	};

	public get light() {
		const { value } = this;
		const { category, name, type, step } = value;
		return Color.#get_by_scheme(category, name, type, step, "light");
	}

	public get dark() {
		const { value } = this;
		const { category, name, type, step } = value;
		return Color.#get_by_scheme(category, name, type, step, "dark");
	}
}

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
