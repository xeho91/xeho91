import { Alpha } from "@xeho91/lib-css/data-type/alpha";
import { Chroma } from "@xeho91/lib-css/data-type/chroma";
import { Hue } from "@xeho91/lib-css/data-type/hue";
import { Lightness } from "@xeho91/lib-css/data-type/lightness";
import { Oklch } from "@xeho91/lib-css/function/oklch";
import { unreachable } from "@xeho91/lib-error/unreachable";
import { Percentage } from "@xeho91/lib-struct/percentage";
import { Range } from "@xeho91/lib-struct/range";
import type { ReadonlyTuple } from "@xeho91/lib-type/tuple";
import { type Oklch as OklchCulori, interpolate, samples } from "culori";

import type { AtomicColor } from "./atomic";

export class ColorGradient<TFrom extends AtomicColor = AtomicColor, TTo extends AtomicColor = AtomicColor> {
	public static readonly STOPS = new Range(1, 5, 1);

	public static get_offset(position: number): Percentage<number, 100> {
		return new Percentage(position * (100 / ColorGradient.STOPS.max));
	}

	public readonly from: TFrom;
	public readonly to: TTo;

	constructor(from: TFrom, to: TTo) {
		this.from = from;
		this.to = to;
	}

	public get stops(): ColorSamplesTuple {
		const interpolated = interpolate([this.from.culori_oklch, this.to.culori_oklch], "oklch");
		return Object.freeze(samples(ColorGradient.STOPS.max).map(interpolated)) as ColorSamplesTuple;
	}

	public get_stop(position: number): Oklch {
		const stop = this.stops[position - 1];
		if (!stop) throw unreachable("Position argument should be in range of 1..5");
		const { l, c, h = 0, alpha: a = 100 } = stop;
		return new Oklch({
			lightness: Lightness.percentage(l),
			chroma: Chroma.percentage(c),
			hue: Hue.degree(h),
			alpha: Alpha.percentage(a),
		});
	}
}

type ColorSamplesTuple = ReadonlyTuple<OklchCulori, 5>;

if (import.meta.vitest) {
	const { PRIMARY_SOLID_1_LIGHT, PRIMARY_SOLID_12_LIGHT } = await import("#palette/brand/primary");
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(ColorGradient.name, () => {
		it("constructor", ({ expect }) => {
			const gradient = new ColorGradient(PRIMARY_SOLID_1_LIGHT, PRIMARY_SOLID_12_LIGHT);
			expect(gradient).toBeInstanceOf(ColorGradient);
			expectTypeOf(gradient).toEqualTypeOf<
				ColorGradient<typeof PRIMARY_SOLID_1_LIGHT, typeof PRIMARY_SOLID_12_LIGHT>
			>();
		});

		it("get stops", ({ expect }) => {
			const { stops } = new ColorGradient(PRIMARY_SOLID_1_LIGHT, PRIMARY_SOLID_12_LIGHT);
			expect(stops).toBeInstanceOf(Array);
			expectTypeOf(stops).toEqualTypeOf<
				readonly [OklchCulori, OklchCulori, OklchCulori, OklchCulori, OklchCulori]
			>();
			expect(stops[0]).toStrictEqual(PRIMARY_SOLID_1_LIGHT.culori_oklch);
			expect(stops[4]).toStrictEqual(PRIMARY_SOLID_12_LIGHT.culori_oklch);
		});

		it("get_stop(position)", ({ expect }) => {
			const gradient = new ColorGradient(PRIMARY_SOLID_1_LIGHT, PRIMARY_SOLID_12_LIGHT);
			const stop_1 = gradient.get_stop(1);
			const stop_5 = gradient.get_stop(5);
			expect(stop_1).toBeInstanceOf(Oklch);
			expect(stop_1).toStrictEqual(PRIMARY_SOLID_1_LIGHT.oklch);
			expect(stop_5).toBeInstanceOf(Oklch);
			expect(stop_5).toStrictEqual(PRIMARY_SOLID_12_LIGHT.oklch);
		});
	});
}
