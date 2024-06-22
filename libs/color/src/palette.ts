import type { ReadonlyTuple } from "type-fest/source/readonly-tuple";
import type { Subtract } from "type-fest/source/subtract";

import type { Color, ColorCategory, ColorName, ColorScheme, ColorStep, ColorType } from "#instance";

interface ColorTypeSchemes<TCategory extends ColorCategory, TName extends ColorName, TType extends ColorType> {
	light: ReadonlyTuple<Color<TCategory, TName, TType, "light", ColorStep>, 12>;
	dark: ReadonlyTuple<Color<TCategory, TName, TType, "dark", ColorStep>, 12>;
}

export class ColorPalette<
	const TCategory extends ColorCategory = ColorCategory,
	const TName extends ColorName = ColorName,
	const TSolid extends ColorTypeSchemes<TCategory, TName, "solid"> = ColorTypeSchemes<TCategory, TName, "solid">,
	const TBlend extends ColorTypeSchemes<TCategory, TName, "blend"> = ColorTypeSchemes<TCategory, TName, "blend">,
> {
	public readonly category: TCategory;
	public readonly name: TName;

	readonly #solid: TSolid;
	readonly #blend: TBlend;

	constructor({
		category,
		name,
		solid,
		blend,
	}: {
		category: TCategory;
		name: TName;
		solid: TSolid;
		blend: TBlend;
	}) {
		this.category = category;
		this.name = name;
		this.#solid = solid;
		this.#blend = blend;
	}

	public solid<IScheme extends ColorScheme, IStep extends ColorStep = 8>(scheme: IScheme, step: IStep = 8 as IStep) {
		return this.#solid[scheme][(step - 1) as Subtract<IStep, 1>];
	}

	public blend<IScheme extends ColorScheme, IStep extends ColorStep = 8>(scheme: IScheme, step: IStep = 8 as IStep) {
		return this.#blend[scheme][(step - 1) as Subtract<IStep, 1>];
	}
}
