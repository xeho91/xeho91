/**
 * Color instance.
 * @module
 */

import type { Display } from "@xeho91/lib-type/trait/display";
import type { Oklch as CuloriOklch } from "culori/fn";
import { Oklch } from "@xeho91/lib-css/function/oklch";
import type { Percentage } from "@xeho91/lib-css/value/percentage";
import type { Dimension } from "@xeho91/lib-css/value/dimension";
import { Lightness } from "@xeho91/lib-css/data-type/lightness";
import { Chroma } from "@xeho91/lib-css/data-type/chroma";
import { Hue } from "@xeho91/lib-css/data-type/hue";
import { Alpha } from "@xeho91/lib-css/data-type/alpha";

import type { ColorCategory, ColorName, ColorScheme, ColorStep, ColorType } from "#mod";

interface OklchProperties {
	lightness: Percentage;
	chroma: Percentage;
	hue: Dimension<number, "deg">;
	alpha: Percentage;
}

export class AtomicColor<
	TCategory extends ColorCategory = ColorCategory,
	TName extends ColorName = ColorName,
	TType extends ColorType = ColorType,
	TStep extends ColorStep = ColorStep,
	TScheme extends ColorScheme = ColorScheme,
	const TOklch extends OklchProperties = OklchProperties,
> implements Display<TName>
{
	/**
	 * @see {@link ColorCategory}
	 */
	public readonly category: TCategory;
	/**
	 * @see {@link ColorName}
	 */
	public readonly name: TName;
	/**
	 * @see {@link ColorType}
	 */
	public readonly type: TType;
	/**
	 * @see {@link ColorStep}
	 */
	public readonly step: TStep;
	/**
	 * @see {@link ColorScheme}
	 */
	public readonly scheme: TScheme;

	public readonly lightness: TOklch["lightness"];
	public readonly chroma: TOklch["chroma"];
	public readonly hue: TOklch["hue"];
	public readonly alpha: TOklch["alpha"];

	constructor({
		category,
		name,
		type,
		step,
		scheme,
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
		this.type = type;
		this.step = step;
		const { lightness, chroma, hue, alpha } = oklch;
		this.lightness = lightness;
		this.chroma = chroma;
		this.hue = hue;
		this.alpha = alpha;
	}

	public toString(): TName {
		return this.name;
	}

	public get oklch() {
		const { lightness, chroma, hue, alpha } = this;
		return new Oklch({
			lightness: new Lightness(lightness),
			chroma: new Chroma(chroma),
			hue: new Hue(hue),
			alpha: new Alpha(alpha),
		});
	}

	public get culori_oklch(): CuloriOklch {
		// WARN: Might need to convert
		return {
			mode: "oklch",
			l: this.lightness.value,
			c: this.chroma.value,
			h: this.hue.value,
			alpha: this.alpha.value,
		};
	}
}
