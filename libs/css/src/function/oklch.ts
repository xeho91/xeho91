import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { Alpha } from "#data-type/alpha";
import { Chroma } from "#data-type/chroma";
import { Hue } from "#data-type/hue";
import { Lightness } from "#data-type/lightness";
import { FunctionChildren, FunctionBase } from "#function";
import { Operator } from "#operator";
import { Color } from "#data-type/color";

export type OklchPropertyName = IterableElement<typeof Oklch.PROPERTIES>;

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch}
 */
export class Oklch<
	TL extends Lightness = Lightness,
	TC extends Chroma = Chroma,
	TH extends Hue = Hue,
	TA extends Alpha = Alpha,
> extends FunctionBase<"oklch", Children<TL, TC, TH, TA>> {
	public static default = () =>
		new Oklch({
			lightness: Lightness.default(),
			chroma: Chroma.default(),
			hue: Hue.default(),
			alpha: Alpha.default(),
		});

	public static readonly PROPERTIES = readonly_set([
		//
		"lightness",
		"chroma",
		"hue",
		"alpha",
	]);

	public static [Symbol.iterator](): IterableIterator<OklchPropertyName> {
		return Oklch.PROPERTIES[Symbol.iterator]();
	}

	public lightness: TL;
	public chroma: TC;
	public hue: TH;
	public alpha: TA;

	constructor(data: { lightness: TL; chroma: TC; hue: TH; alpha: TA }) {
		super("oklch");
		const { lightness, chroma, hue, alpha } = data;
		this.lightness = lightness;
		this.chroma = chroma;
		this.hue = hue;
		this.alpha = alpha;
	}

	public get children(): Children<TL, TC, TH, TA> {
		const { lightness, chroma, hue, alpha } = this;
		return new FunctionChildren(
			//
			lightness,
			chroma,
			hue,
			Operator.FORWARD_SLASH,
			alpha,
		);
	}

	public to_color(): Color<typeof this> {
		return new Color(this);
	}
}

type Children<
	//
	TL extends Lightness,
	TC extends Chroma,
	TH extends Hue,
	TA extends Alpha,
> = FunctionChildren<[TL, TC, TH, Operator<"/">, TA]>;

if (import.meta.vitest) {
	const { describe, it, expectTypeOf } = import.meta.vitest;

	describe(Oklch.name, () => {
		describe("toString()", () => {
			it("returns typed stringified", ({ expect }) => {
				const oklch = Oklch.default();
				const stringified = oklch.toString();
				const expected = "oklch(0% 0% 0deg / 100%)";
				expect(stringified).toBe(expected);
				expectTypeOf(stringified).toEqualTypeOf<typeof expected>();
			});
		});
	});
}
