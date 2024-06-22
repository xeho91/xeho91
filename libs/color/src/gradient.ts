import { type Oklch, interpolate, samples } from "culori/fn";
import type { ReadonlyTuple } from "type-fest/source/readonly-tuple";

import type { Color } from "#instance";

export class ColorGradient<TFrom extends Color = Color, TTo extends Color = Color> {
	public readonly from: TFrom;
	public readonly to: TTo;

	constructor(from: TFrom, to: TTo) {
		this.from = from;
		this.to = to;
	}

	public get interpolate(): ReturnType<typeof interpolate<"oklch">> {
		return interpolate<"oklch">([this.from.culori_oklch, this.to.culori_oklch]);
	}

	public get samples(): ColorSamplesTuple {
		return Object.freeze(samples(5).map(this.interpolate)) as ColorSamplesTuple;
	}
}

type ColorSamplesTuple = ReadonlyTuple<Oklch, 5>;
