import { unreachable } from "@xeho91/lib-error/unreachable";
import { Percentage } from "@xeho91/lib-struct/percentage";
import { Range } from "@xeho91/lib-struct/range";
import { type Oklch, interpolate, samples } from "culori";
import type { ReadonlyTuple } from "type-fest/source/readonly-tuple";

import type { Color } from "#instance";
import { ColorOklch } from "#oklch";
import { PRIMARY_SOLID_LIGHT_1, PRIMARY_SOLID_LIGHT_12 } from "#palette/brand/primary";

export class ColorGradient<TFrom extends Color = Color, TTo extends Color = Color> {
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

	public get_stop(position: number) {
		const stop = this.stops[position - 1];
		if (!stop) throw unreachable("Position argument should be in range of 1..5");
		const { l, c, h = 0, alpha: a = 100 } = stop;
		return new ColorOklch({ l, c, h, a });
	}
}

type ColorSamplesTuple = ReadonlyTuple<Oklch, 5>;

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(ColorGradient.name, () => {
		it("constructor", ({ expect }) => {
			const gradient = new ColorGradient(PRIMARY_SOLID_LIGHT_1, PRIMARY_SOLID_LIGHT_12);

			expect(gradient).toBeInstanceOf(ColorGradient);
			expectTypeOf(gradient).toEqualTypeOf<
				ColorGradient<
					Color<"brand", "primary", "solid", "light", 1, ColorOklch<99.32, 0.84, 325.6, 100>>,
					Color<"brand", "primary", "solid", "light", 12, ColorOklch<32.22, 27.55, 303.84, 100>>
				>
			>();
		});

		it("get stops", ({ expect }) => {
			const stops = new ColorGradient(PRIMARY_SOLID_LIGHT_1, PRIMARY_SOLID_LIGHT_12).stops;

			expect(stops).toBeInstanceOf(Array);
			expectTypeOf(stops).toEqualTypeOf<readonly [Oklch, Oklch, Oklch, Oklch, Oklch]>();
			expect(stops[0]).toStrictEqual(PRIMARY_SOLID_LIGHT_1.culori_oklch);
			expect(stops[4]).toStrictEqual(PRIMARY_SOLID_LIGHT_12.culori_oklch);
		});

		it("get_stop(position)", ({ expect }) => {
			const gradient = new ColorGradient(PRIMARY_SOLID_LIGHT_1, PRIMARY_SOLID_LIGHT_12);
			const stop_1 = gradient.get_stop(1);
			const stop_5 = gradient.get_stop(5);

			expect(stop_1).toBeInstanceOf(ColorOklch);
			expect(stop_1).toStrictEqual(PRIMARY_SOLID_LIGHT_1.oklch);
			expect(stop_5).toBeInstanceOf(ColorOklch);
			expect(stop_5).toStrictEqual(PRIMARY_SOLID_LIGHT_12.oklch);
		});
	});
}
