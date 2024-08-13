import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";

import type { InferAST, ToAST } from "#ast";
import { Blur } from "#data-type/blur";
import { Color } from "#data-type/color";
import { Offset } from "#data-type/offset";
import { Declaration } from "#declaration";
import { Oklch } from "#function/oklch";
import type { Identifier } from "#identifier";
import { Operator } from "#operator";
import { Property } from "#property";
import { Reference } from "#reference";
import { type InferValue, type ToValue, Value } from "#value";
import { Dimension } from "#value/dimension";
import { NumberCSS } from "#value/number";

export type TextShadowAtomicProperty = IterableElement<typeof TextShadowLayer.ATOMIC_PROPERTIES>;

export class TextShadowLayer<
	TX extends Offset<"x"> = Offset<"x">,
	TY extends Offset<"y"> = Offset<"y">,
	TBlur extends Blur = Blur,
	TColor extends Color = Color,
> implements Display, ToValue
{
	public static readonly NAME = "text-shadow";
	public static readonly ATOMIC_PROPERTIES = readonly_set(["x", "y", "blur", "color"]);

	public static [Symbol.iterator](): IterableIterator<TextShadowAtomicProperty> {
		return TextShadowLayer.ATOMIC_PROPERTIES[Symbol.iterator]();
	}

	public static create_reference = <TNumber extends number>(number: TNumber) =>
		new Reference(`${TextShadowLayer.NAME}-layer-${number}`);

	public static create_atomized_layer = <TNumber extends number>(number: TNumber) => {
		const prefix = `${TextShadowLayer.NAME}-${number}`;
		return new TextShadowLayer({
			x: Offset.from_reference("x", Offset.create_reference("x", prefix)),
			y: Offset.from_reference("y", Offset.create_reference("y", prefix)),
			blur: Blur.from_reference(Blur.create_reference(prefix)),
			color: Color.from_reference(Color.create_reference(prefix)),
		});
	};

	public x: TX;
	public y: TY;
	public blur: TBlur;
	public color: TColor;

	constructor(props: { x: TX; y: TY; blur: TBlur; color: TColor }) {
		const { x, y, blur, color } = props;
		this.x = x;
		this.y = y;
		this.blur = blur;
		this.color = color;
	}

	public toString(): StringifiedLayer<TX, TY, TBlur, TColor> {
		return this.to_value().toString() as StringifiedLayer<TX, TY, TBlur, TColor>;
	}

	public to_value(): TextShadowLayerValue<TX, TY, TBlur, TColor> {
		const { x, y, blur, color } = this;
		return new Value(x, y, blur, color);
	}
}

type TextShadowLayerValue<
	TX extends Offset<"x">,
	TY extends Offset<"y">,
	TBlur extends Blur,
	TColor extends Color,
> = Value<[TX, TY, TBlur, TColor]>;

type StringifiedLayer<
	TX extends Offset<"x">,
	TY extends Offset<"y">,
	TBlur extends Blur,
	TColor extends Color,
> = ToString<TextShadowLayerValue<TX, TY, TBlur, TColor>>;

if (import.meta.vitest) {
	const { describe, it, expectTypeOf } = import.meta.vitest;

	describe(TextShadowLayer.name, () => {
		describe("to_value()", () => {
			it("returns correct value when inset was false (by default)", ({ expect }) => {
				const value = new TextShadowLayer({
					x: Offset.default("x"),
					y: Offset.default("y"),
					blur: Blur.default(),
					color: Color.default(),
				}).to_value();
				expect(value).toBeInstanceOf(Value);
			});
		});

		describe("toString()", () => {
			it("returns typed stringified declaration", ({ expect }) => {
				const text_shadow = new TextShadowLayer({
					x: Offset.default("x"),
					y: Offset.default("y"),
					blur: Blur.default(),
					color: Color.default(),
				});
				const stringified = text_shadow.toString();
				const expected = "0px 0px 0px transparent";
				expect(stringified).toBe(expected);
				expectTypeOf(stringified).toEqualTypeOf<typeof expected>();
			});
		});
	});
}

export class TextShadow<const TLayers extends TextShadowLayer[]>
	extends IterableInstance<TextShadowLayer>
	implements ToAST, ToValue
{
	public static readonly PROPERTY = new Property("text-shadow");

	public static readonly layer = TextShadowLayer;

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

	public to_value(): TextShadowValue<TLayers> {
		const { iterable } = this;
		if (iterable[0] && iterable.length === 1) return iterable[0].to_value() as unknown as TextShadowValue<TLayers>;
		// biome-ignore lint/style/useConst: Readability: it's 'mutating'
		let value_items: ConstructorParameters<typeof Value> = [];
		let index = 0;
		for (const layer of iterable) {
			value_items.push(...layer.to_value().list);
			if (index < iterable.length - 1) value_items.push(Operator.COMMA);
			index++;
		}
		return new Value(...value_items) as TextShadowValue<TLayers>;
	}

	/*@__NO_SIDE_EFFECTS__*/
	public to_ast(): InferAST<typeof this.declaration> {
		const { declaration } = this;
		return declaration.to_ast();
	}

	public get declaration(): Declaration<typeof TextShadow.PROPERTY, TextShadowValue<TLayers>> {
		return new Declaration(TextShadow.PROPERTY, this.to_value());
	}
}

type TextShadowValue<TLayers extends TextShadowLayer[]> = TLayers extends [
	infer TFirst extends TextShadowLayer,
	...infer TRest extends TextShadowLayer[],
]
	? TRest extends []
		? InferValue<TFirst>
		: Value<[...InferValue<TFirst>["list"], Operator<",">, TextShadowValue<TRest>]>
	: never;

type Stringified<TLayers extends TextShadowLayer[]> = ToString<
	Declaration<typeof TextShadow.PROPERTY, TextShadowValue<TLayers>>
>;

if (import.meta.vitest) {
	const { describe, it, expectTypeOf } = import.meta.vitest;

	describe(TextShadow.name, () => {
		describe("get value", () => {
			it("returns correctly single layer", ({ expect }) => {
				const value = new TextShadow(
					new TextShadowLayer({
						x: Offset.default("x"),
						y: Offset.default("y"),
						blur: Blur.default(),
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
							Color<Identifier<"transparent">>,
						]
					>
				>();
			});

			it("returns correctly multiple layer", ({ expect }) => {
				const layer1 = new TextShadowLayer({
					x: Offset.default("x"),
					y: Offset.default("y"),
					blur: Blur.default(),
					color: Color.default(),
				});
				const layer2 = new TextShadowLayer({
					x: new Offset("x", new NumberCSS(2)),
					y: new Offset("y", new NumberCSS(2)),
					blur: Blur.default(),
					color: Color.default(),
				});
				const layer3 = new TextShadowLayer({
					x: new Offset("x", new NumberCSS(3)),
					y: new Offset("y", new NumberCSS(3)),
					blur: Blur.default(),
					color: Color.default(),
				});

				const value = new TextShadow(layer1, layer2, layer3).to_value();
				expect(value).toBeInstanceOf(Value);
			});
		});

		describe("toString()", () => {
			it("returns typed stringified declaration for single layer", ({ expect }) => {
				const text_shadow = new TextShadow(
					new TextShadowLayer({
						x: Offset.default("x"),
						y: Offset.default("y"),
						blur: Blur.default(),
						color: Color.default(),
					}),
				);
				const stringified = text_shadow.toString();
				const expected = "text-shadow:0px 0px 0px transparent;";
				expect(stringified).toBe(expected);
				expectTypeOf(stringified).toEqualTypeOf<typeof expected>();
			});

			it("returns typed stringified declaration for multiple layers", ({ expect }) => {
				const layer1 = new TextShadowLayer({
					x: Offset.default("x"),
					y: Offset.default("y"),
					blur: Blur.default(),
					color: Color.default(),
				});
				const layer2 = new TextShadowLayer({
					x: new Offset("x", new NumberCSS(2)),
					y: new Offset("y", new NumberCSS(2)),
					blur: Blur.default(),
					color: Color.default(),
				});
				const layer3 = new TextShadowLayer({
					x: new Offset("x", new Dimension(3, "px")),
					y: new Offset("y", new Dimension(3, "px")),
					blur: Blur.default(),
					color: new Color(Oklch.default()),
				});
				const text_shadow = new TextShadow(layer1, layer2, layer3);
				const stringified = text_shadow.toString();
				const expected =
					"text-shadow:0px 0px 0px transparent , 2 2 0px transparent , 3px 3px 0px oklch(0% 0% 0deg / 100%);";
				expect(stringified).toBe(expected);
				expectTypeOf(stringified).toEqualTypeOf<typeof expected>();
			});
		});
	});
}
