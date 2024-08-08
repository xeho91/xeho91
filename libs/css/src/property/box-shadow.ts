import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";

import { Blur } from "#data-type/blur";
import { Color } from "#data-type/color";
import { Offset } from "#data-type/offset";
import { Spread } from "#data-type/spread";
import { Declaration } from "#declaration";
import { Oklch } from "#function/oklch";
import { Identifier } from "#identifier";
import { Operator } from "#operator";
import { Property } from "#property";
import type { InferAST, ToAST } from "#type";
import { type InferValue, type ToValue, Value } from "#value";
import { Dimension } from "#value/dimension";
import { NumberCSS } from "#value/number";
import { Reference } from "#reference";

export type BoxShadowAtomicProperty = IterableElement<typeof BoxShadowLayer.ATOMIC_PROPERTIES>;

export class BoxShadowLayer<
	TInset extends boolean = false,
	TX extends Offset<"x"> = Offset<"x">,
	TY extends Offset<"y"> = Offset<"y">,
	TBlur extends Blur = Blur,
	TSpread extends Spread = Spread,
	TColor extends Color = Color,
> implements Display<StringifiedLayer<TInset, TX, TY, TBlur, TSpread, TColor>>, ToValue {
	public static readonly NAME = "box-shadow";
	public static readonly ATOMIC_PROPERTIES = readonly_set(["x", "y", "blur", "spread", "color"]);

	public static [Symbol.iterator](): IterableIterator<BoxShadowAtomicProperty> {
		return BoxShadowLayer.ATOMIC_PROPERTIES[Symbol.iterator]();
	}

	public static create_reference = <TNumber extends number>(number: TNumber) =>
		new Reference(`${BoxShadowLayer.NAME}-${number}`);

	public static create_atomized = <TNumber extends number>(number: TNumber) => {
		const prefix = `${BoxShadowLayer.NAME}-${number}`;
		return new BoxShadowLayer({
			x: Offset.from_reference("x", Offset.create_reference("x", prefix)),
			y: Offset.from_reference("y", Offset.create_reference("y", prefix)),
			blur: Blur.from_reference(Blur.create_reference(prefix)),
			spread: Spread.from_reference(Spread.create_reference(prefix)),
			color: Color.from_reference(Color.create_reference(prefix)),
		});
	};

	public inset: TInset;
	public x: TX;
	public y: TY;
	public blur: TBlur;
	public spread: TSpread;
	public color: TColor;

	constructor(data: { inset?: TInset; x: TX; y: TY; blur: TBlur; spread: TSpread; color: TColor }) {
		const { inset = false as TInset, x, y, blur, spread, color } = data;
		this.inset = inset;
		this.x = x;
		this.y = y;
		this.blur = blur;
		this.spread = spread;
		this.color = color;
	}

	public toString(): StringifiedLayer<TInset, TX, TY, TBlur, TSpread, TColor> {
		return this.to_value().toString() as StringifiedLayer<TInset, TX, TY, TBlur, TSpread, TColor>;
	}

	public to_value(): BoxShadowLayerValue<TInset, TX, TY, TBlur, TSpread, TColor> {
		const { inset, x, y, blur, spread, color } = this;
		// biome-ignore lint/style/useConst: Readability: it's 'mutating'
		let args: ConstructorParameters<typeof Value> = [x, y, blur, spread, color];
		if (inset) args.unshift(new Identifier("inset"));
		return new Value(...args) as BoxShadowLayerValue<TInset, TX, TY, TBlur, TSpread, TColor>;
	}
}

type BoxShadowLayerValue<
	TInset extends boolean,
	TX extends Offset<"x">,
	TY extends Offset<"y">,
	TBlur extends Blur,
	TSpread extends Spread,
	TColor extends Color,
> = TInset extends true
	? Value<[Identifier<"inset">, TX, TY, TBlur, TSpread, TColor]>
	: Value<[TX, TY, TBlur, TSpread, TColor]>;

type StringifiedLayer<
	TInset extends boolean,
	TX extends Offset<"x">,
	TY extends Offset<"y">,
	TBlur extends Blur,
	TSpread extends Spread,
	TColor extends Color,
> = ToString<BoxShadowLayerValue<TInset, TX, TY, TBlur, TSpread, TColor>>;

if (import.meta.vitest) {
	const { describe, it, expectTypeOf } = import.meta.vitest;

	describe(BoxShadowLayer.name, () => {
		describe("to_value()", () => {
			it("returns correct value when inset was false (by default)", ({ expect }) => {
				const value = new BoxShadowLayer({
					x: Offset.default("x"),
					y: Offset.default("y"),
					blur: Blur.default(),
					spread: Spread.default(),
					color: Color.default(),
				}).to_value();
				expect(value).toBeInstanceOf(Value);
			});
		});

		describe("toString()", () => {
			it("returns typed stringified declaration", ({ expect }) => {
				const box_shadow = new BoxShadowLayer({
					x: Offset.default("x"),
					y: Offset.default("y"),
					blur: Blur.default(),
					spread: Spread.default(),
					color: Color.default(),
				});
				const stringified = box_shadow.toString();
				const expected = "0px 0px 0px 0px transparent";
				expect(stringified).toBe(expected);
				expectTypeOf(stringified).toEqualTypeOf<typeof expected>();
			});
		});
	});
}

export class BoxShadow<const TLayers extends BoxShadowLayer[]>
	extends IterableInstance<BoxShadowLayer>
	implements ToAST, ToValue {
	public static readonly PROPERTY = new Property("box-shadow");

	public static layer = BoxShadowLayer;

	protected iterable: TLayers;

	constructor(...layers: TLayers) {
		super();
		this.iterable = layers;
	}

	public toString(): Stringified<TLayers> {
		const { declaration } = this;
		return declaration.toString();
	}

	public get layers(): TLayers {
		return this.iterable;
	}

	public set layers(layers: TLayers) {
		this.iterable = layers;
	}

	public to_value(): BoxShadowValue<TLayers> {
		const { layers } = this;
		if (layers[0] && layers.length === 1) return layers[0].to_value() as unknown as BoxShadowValue<TLayers>;
		// biome-ignore lint/style/useConst: Readability - mutation
		let value_items: ConstructorParameters<typeof Value> = [];
		let index = 0;
		for (const layer of layers) {
			value_items.push(...layer.to_value().list);
			if (index < layers.length - 1) value_items.push(Operator.COMMA);
			index++;
		}
		return new Value(...value_items) as BoxShadowValue<TLayers>;
	}

	public to_ast(): InferAST<typeof this.declaration> {
		const { declaration } = this;
		return declaration.to_ast();
	}

	public get declaration(): Declaration<typeof BoxShadow.PROPERTY, BoxShadowValue<TLayers>> {
		return new Declaration(BoxShadow.PROPERTY, this.to_value());
	}
}

type BoxShadowValue<TLayers extends BoxShadowLayer[]> = TLayers extends [
	infer TFirst extends BoxShadowLayer,
	...infer TRest extends BoxShadowLayer[],
]
	? TRest extends []
	? InferValue<TFirst>
	: Value<[...InferValue<TFirst>["list"], Operator<",">, BoxShadowValue<TRest>]>
	: never;

type Stringified<TLayers extends BoxShadowLayer[]> = ToString<
	Declaration<typeof BoxShadow.PROPERTY, BoxShadowValue<TLayers>>
>;

if (import.meta.vitest) {
	const { describe, it, expectTypeOf } = import.meta.vitest;

	describe(BoxShadow.name, () => {
		describe("get value", () => {
			it("returns correctly single layer", ({ expect }) => {
				const value = new BoxShadow(
					new BoxShadowLayer({
						x: Offset.default("x"),
						y: Offset.default("y"),
						blur: Blur.default(),
						spread: Spread.default(),
						color: Color.default(),
					}),
				).to_value();
				expect(value).toBeInstanceOf(Value);
				expectTypeOf(value).toEqualTypeOf<
					Value<
						[
							Offset<"x", Dimension<0, "px">>,
							Offset<"y", Dimension<0, "px">>,
							Blur<Dimension<0, "px">>,
							Spread<Dimension<0, "px">>,
							Color<Identifier<"transparent">>,
						]
					>
				>();
			});

			it("returns correctly multiple layer", ({ expect }) => {
				const layer1 = new BoxShadowLayer({
					x: Offset.default("x"),
					y: Offset.default("y"),
					blur: Blur.default(),
					spread: Spread.default(),
					color: Color.default(),
				});
				const layer2 = new BoxShadowLayer({
					x: new Offset("x", new NumberCSS(2)),
					y: new Offset("y", new NumberCSS(2)),
					blur: Blur.default(),
					spread: Spread.default(),
					color: Color.default(),
				});
				const layer3 = new BoxShadowLayer({
					x: new Offset("x", new NumberCSS(3)),
					y: new Offset("y", new NumberCSS(3)),
					blur: Blur.default(),
					spread: Spread.default(),
					color: Color.default(),
				});

				const value = new BoxShadow(layer1, layer2, layer3).to_value();
				expect(value).toBeInstanceOf(Value);
			});
		});

		describe("toString()", () => {
			it("returns typed stringified declaration for single layer", ({ expect }) => {
				const box_shadow = new BoxShadow(
					new BoxShadowLayer({
						x: Offset.default("x"),
						y: Offset.default("y"),
						blur: Blur.default(),
						spread: Spread.default(),
						color: Color.default(),
					}),
				);
				const stringified = box_shadow.toString();
				const expected = "box-shadow:0px 0px 0px 0px transparent";
				expect(stringified).toBe(expected);
				expectTypeOf(stringified).toEqualTypeOf<typeof expected>();
			});

			it("returns typed stringified declaration for multiple layers", ({ expect }) => {
				const layer1 = new BoxShadowLayer({
					x: Offset.default("x"),
					y: Offset.default("y"),
					blur: Blur.default(),
					spread: Spread.default(),
					color: Color.default(),
				});
				const layer2 = new BoxShadowLayer({
					x: new Offset("x", new Dimension(2, "px")),
					y: new Offset("y", new Dimension(2, "px")),
					blur: Blur.default(),
					spread: Spread.default(),
					color: Color.default(),
				});
				const layer3 = new BoxShadowLayer({
					x: new Offset("x", new Dimension(3, "px")),
					y: new Offset("y", new Dimension(3, "px")),
					blur: Blur.default(),
					spread: Spread.default(),
					color: new Color(Oklch.default()),
				});
				const box_shadow = new BoxShadow(layer1, layer2, layer3);
				const stringified = box_shadow.toString();
				const expected =
					"box-shadow:0px 0px 0px 0px transparent , 2px 2px 0px 0px transparent , 3px 3px 0px 0px oklch(0% 0% 0deg / 100%)";
				expect(stringified).toBe(expected);
				expectTypeOf(stringified).toEqualTypeOf<typeof expected>();
			});
		});

		describe("get declaration", () => {
			it("returns correctly a declaration instance for single atomized layer", ({ expect }) => {
				const atomized = BoxShadow.layer.create_atomized(1);
				const box_shadow = new BoxShadow(atomized);
				const { declaration } = box_shadow;
				expect(declaration).toBeInstanceOf(Declaration);
				expect(declaration.toString()).toMatchInlineSnapshot(
					`"box-shadow:var(--box-shadow-1-x) var(--box-shadow-1-y) var(--box-shadow-1-blur) var(--box-shadow-1-spread) var(--box-shadow-1-color)"`,
				);
			});

			it("returns correctly a declaration instance for multiple atomized layers", ({ expect }) => {
				const atomized_1 = BoxShadow.layer.create_atomized(1);
				const atomized_2 = BoxShadow.layer.create_atomized(2);
				const atomized_3 = BoxShadow.layer.create_atomized(3);
				const box_shadow = new BoxShadow(atomized_1, atomized_2, atomized_3);
				const { declaration } = box_shadow;
				expect(declaration).toBeInstanceOf(Declaration);
				expect(declaration.toString()).toMatchInlineSnapshot(
					`"box-shadow:var(--box-shadow-1-x) var(--box-shadow-1-y) var(--box-shadow-1-blur) var(--box-shadow-1-spread) var(--box-shadow-1-color) , var(--box-shadow-2-x) var(--box-shadow-2-y) var(--box-shadow-2-blur) var(--box-shadow-2-spread) var(--box-shadow-2-color) , var(--box-shadow-3-x) var(--box-shadow-3-y) var(--box-shadow-3-blur) var(--box-shadow-3-spread) var(--box-shadow-3-color)"`,
				);
			});
		});

		describe("to_value()", () => {
			it("converts atomized single layer correctly", ({ expect }) => {
				const atomized = BoxShadow.layer.create_atomized(1);
				const box_shadow = new BoxShadow(atomized);
				const value = box_shadow.to_value();
				expect(value).toBeInstanceOf(Value);
				expect(value.toString()).toMatchInlineSnapshot(
					`"var(--box-shadow-1-x) var(--box-shadow-1-y) var(--box-shadow-1-blur) var(--box-shadow-1-spread) var(--box-shadow-1-color)"`,
				);
			});

			it("converts atomized multiple layer correctly", ({ expect }) => {
				const atomized_1 = BoxShadow.layer.create_atomized(1);
				const atomized_2 = BoxShadow.layer.create_atomized(2);
				const atomized_3 = BoxShadow.layer.create_atomized(3);
				const box_shadow = new BoxShadow(atomized_1, atomized_2, atomized_3);
				const value = box_shadow.to_value();
				expect(value).toBeInstanceOf(Value);
				expect(value.toString()).toMatchInlineSnapshot(
					`"var(--box-shadow-1-x) var(--box-shadow-1-y) var(--box-shadow-1-blur) var(--box-shadow-1-spread) var(--box-shadow-1-color) , var(--box-shadow-2-x) var(--box-shadow-2-y) var(--box-shadow-2-blur) var(--box-shadow-2-spread) var(--box-shadow-2-color) , var(--box-shadow-3-x) var(--box-shadow-3-y) var(--box-shadow-3-blur) var(--box-shadow-3-spread) var(--box-shadow-3-color)"`,
				);
			});
		});
	});
}
