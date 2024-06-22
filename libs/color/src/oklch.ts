import type { UnitStruct } from "@xeho91/lib-type/struct";
import type { Display, ToString } from "@xeho91/lib-type/trait/display";

export class ColorLightness<const TValue extends number = number>
	implements UnitStruct<TValue>, Display<StringifiedLightness<TValue>>
{
	readonly #value: TValue;

	constructor(value: TValue) {
		this.#value = value;
	}

	public valueOf(): TValue {
		return this.#value;
	}

	public toString(): StringifiedLightness<TValue> {
		return `${this.#value}%`;
	}
}

type StringifiedLightness<TValue extends number> = `${TValue}%`;

export class ColorChroma<const TValue extends number = number>
	implements UnitStruct<TValue>, Display<StringifiedChroma<TValue>>
{
	readonly #value: TValue;

	constructor(value: TValue) {
		this.#value = value;
	}

	public valueOf(): TValue {
		return this.#value;
	}

	public toString(): StringifiedChroma<TValue> {
		return `${this.#value}%`;
	}
}

type StringifiedChroma<TValue extends number> = `${TValue}%`;

export class ColorHue<const TValue extends number = number>
	implements UnitStruct<TValue>, Display<StringifiedHue<TValue>>
{
	readonly #value: TValue;

	constructor(value: TValue) {
		this.#value = value;
	}

	public valueOf(): TValue {
		return this.#value;
	}

	public toString(): StringifiedHue<TValue> {
		return `${this.#value}deg`;
	}
}

type StringifiedHue<TValue extends number> = `${TValue}deg`;

export class ColorAlpha<const TValue extends number = number>
	implements UnitStruct<TValue>, Display<StringifiedAlpha<TValue>>
{
	readonly #value: TValue;

	constructor(value: TValue) {
		this.#value = value;
	}

	public valueOf(): TValue {
		return this.#value;
	}

	public toString(): StringifiedAlpha<TValue> {
		return `${this.#value}%`;
	}
}

type StringifiedAlpha<TValue extends number> = `${TValue}%`;

export class ColorOklch<
	const TLightness extends number = number,
	const TChroma extends number = number,
	const THue extends number = number,
	const TAlpha extends number = number,
> implements
		Display<StringifiedOklch<ColorLightness<TLightness>, ColorChroma<TChroma>, ColorHue<THue>, ColorAlpha<TAlpha>>>
{
	public readonly lightness: ColorLightness<TLightness>;
	public readonly chroma: ColorChroma<TChroma>;
	public readonly hue: ColorHue<THue>;
	public readonly alpha: ColorAlpha<TAlpha>;

	constructor({ l, c, h, a }: { l: TLightness; c: TChroma; h: THue; a: TAlpha }) {
		this.lightness = new ColorLightness(l);
		this.chroma = new ColorChroma(c);
		this.hue = new ColorHue(h);
		this.alpha = new ColorAlpha(a);
	}

	public toString(): StringifiedOklch<
		ColorLightness<TLightness>,
		ColorChroma<TChroma>,
		ColorHue<THue>,
		ColorAlpha<TAlpha>
	> {
		return `${this.lightness} ${this.chroma} ${this.hue} / ${this.alpha}` as StringifiedOklch<
			ColorLightness<TLightness>,
			ColorChroma<TChroma>,
			ColorHue<THue>,
			ColorAlpha<TAlpha>
		>;
	}
}

type StringifiedOklch<
	TLightness extends ColorLightness,
	TChroma extends ColorChroma,
	THue extends ColorHue,
	TAlpha extends ColorAlpha,
> = `${ToString<TLightness>} ${ToString<TChroma>} ${ToString<THue>} / ${ToString<TAlpha>}`;
