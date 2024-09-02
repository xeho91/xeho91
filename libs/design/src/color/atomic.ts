/**
 * Atomic color instance.
 * @module
 */

import { Alpha } from "@xeho91/lib-css/data-type/alpha";
import { Chroma } from "@xeho91/lib-css/data-type/chroma";
import { Hue } from "@xeho91/lib-css/data-type/hue";
import { Lightness } from "@xeho91/lib-css/data-type/lightness";
import { Oklch } from "@xeho91/lib-css/function/oklch";
import type { Var } from "@xeho91/lib-css/function/var";
import { Reference } from "@xeho91/lib-css/reference";
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { Percentage } from "@xeho91/lib-css/value/percentage";
import type { Display } from "@xeho91/lib-type/trait/display";
import type { Oklch as CuloriOklch } from "culori/fn";

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
> implements Display
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

	public constructor({
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

	public toString(): Name<TCategory, TName, TType, TStep, TScheme> {
		const { category, name, type, step, scheme } = this;
		return `color-${category}-${name}-${type}-${step}-${scheme}`;
	}

	public get oklch(): Oklch<
		Lightness<TOklch["lightness"]>,
		Chroma<TOklch["chroma"]>,
		Hue<TOklch["hue"]>,
		Alpha<TOklch["alpha"]>
	> {
		const { lightness, chroma, hue, alpha } = this;
		return new Oklch({
			lightness: new Lightness(lightness),
			chroma: new Chroma(chroma),
			hue: new Hue(hue),
			alpha: new Alpha(alpha),
		});
	}

	public get reference(): Reference<Name<TCategory, TName, TType, TStep, TScheme>> {
		return new Reference(this.toString());
	}

	public get atomized_oklch(): Oklch<
		Lightness<Var<Reference<`${Name<TCategory, TName, TType, TStep, TScheme>}-lightness`>>>,
		Chroma<Var<Reference<`${Name<TCategory, TName, TType, TStep, TScheme>}-chroma`>>>,
		Hue<Var<Reference<`${Name<TCategory, TName, TType, TStep, TScheme>}-hue`>>>,
		Alpha<Var<Reference<`${Name<TCategory, TName, TType, TStep, TScheme>}-alpha`>>>
	> {
		const { reference } = this;
		return new Oklch({
			lightness: Lightness.from_reference(reference),
			chroma: Chroma.from_reference(reference),
			hue: Hue.from_reference(reference),
			alpha: Alpha.from_reference(reference),
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

type Name<
	TCategory extends ColorCategory,
	TName extends ColorName,
	TType extends ColorType,
	TStep extends ColorStep,
	TScheme extends ColorScheme,
> = `color-${TCategory}-${TName}-${TType}-${TStep}-${TScheme}`;

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(AtomicColor.name, () => {
		const atomized_color = new AtomicColor({
			category: "brand",
			name: "info",
			type: "opaque",
			step: 9,
			scheme: "dark",
			oklch: {
				lightness: new Percentage(0),
				chroma: new Percentage(0),
				hue: new Dimension(0, "deg"),
				alpha: new Percentage(0),
			},
		});

		describe("toString()", () => {
			it("returns stringified name", ({ expect }) => {
				const stringified = atomized_color.toString();
				expect(stringified).toMatchInlineSnapshot(`"color-brand-info-solid-9-dark"`);
				expectTypeOf(stringified).toEqualTypeOf<Name<"brand", "info", "opaque", 9, "dark">>();
			});

			it("stringified returns oklch with literal values", ({ expect }) => {
				const { oklch } = atomized_color;
				expect(oklch.toString()).toMatchInlineSnapshot(`"oklch(0% 0% 0deg / 0%)"`);
			});
		});

		describe("get oklch", () => {
			it("returns correctly an instance", ({ expect }) => {
				const { oklch } = atomized_color;
				expect(oklch).toBeInstanceOf(Oklch);
				expectTypeOf(oklch).toMatchTypeOf<
					Oklch<
						Lightness<Percentage<0>>,
						Chroma<Percentage<0>>,
						Hue<Dimension<0, "deg">>,
						Alpha<Percentage<0>>
					>
				>();
			});

			it("stringified returns oklch with literal values", ({ expect }) => {
				const { oklch } = atomized_color;
				expect(oklch.toString()).toMatchInlineSnapshot(`"oklch(0% 0% 0deg / 0%)"`);
			});
		});

		describe("get atomized_oklch", () => {
			it("returns correctly an instance", ({ expect }) => {
				const { atomized_oklch } = atomized_color;
				expect(atomized_oklch).toBeInstanceOf(Oklch);
				expectTypeOf(atomized_oklch).toMatchTypeOf<Oklch<Lightness<Var>, Chroma<Var>, Hue<Var>, Alpha<Var>>>();
			});
			it("returns correctly an instance", ({ expect }) => {
				const { atomized_oklch } = atomized_color;
				expect(atomized_oklch.toString()).toMatchInlineSnapshot(
					`"oklch(var(--color-brand-info-solid-9-dark-lightness) var(--color-brand-info-solid-9-dark-chroma) var(--color-brand-info-solid-9-dark-hue) / var(--color-brand-info-solid-9-dark-alpha))"`,
				);
			});
		});
	});
}
