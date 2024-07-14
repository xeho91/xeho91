import type { Display } from "@xeho91/lib-type/trait/display";
import type { IsEqual } from "type-fest/source/is-equal";
import type { IterableElement } from "type-fest/source/iterable-element";
import * as v from "valibot";

import { TwoDimensionalFigure } from "#two-dimension/mod";
import { Square } from "#two-dimension/square";

export type RectangleDimensionName = IterableElement<typeof Rectangle.DIMENSIONS>;

export class Rectangle<TWidth extends number = number, THeight extends number = number>
	extends TwoDimensionalFigure
	implements Display<Stringified<TWidth, THeight>>
{
	static readonly #DIMENSIONS = ["width", "height"] as const;
	public static readonly DIMENSIONS = Object.freeze(new Set(Rectangle.#DIMENSIONS));

	#width: TWidth;
	#height: THeight;

	/**
	 * @throws When one of the arguments is less than or equal to 0.
	 */
	constructor(width: TWidth, height: THeight) {
		super();
		const schema = v.pipe(v.number(), v.minValue(0));
		this.#width = v.parse(schema, width) as TWidth;
		this.#height = v.parse(schema, height) as THeight;
	}

	public toString(): Stringified<TWidth, THeight> {
		const { width, height } = this;
		return `Rectangle (${width} x ${height})`;
	}

	public get width() {
		return this.#width;
	}

	public set width(width: TWidth) {
		this.#width = width;
	}

	public get height() {
		return this.#height;
	}

	public set height(height: THeight) {
		this.#height = height;
	}

	public get aspect_ratio(): number {
		return this.#width / this.#height;
	}

	public half<TDimension extends RectangleDimensionName | undefined = undefined>(
		dimension?: TDimension,
	): HalfRectangle<TDimension> {
		const { width, height } = this;
		if (dimension) return (this[dimension] / 2) as HalfRectangle<TDimension>;
		return [width / 2, height / 2] as HalfRectangle<TDimension>;
	}

	public get perimeter(): number {
		const { width, height } = this;
		return 2 * (width + height);
	}

	public get area(): number {
		const { width, height } = this;
		return width * height;
	}

	public get is_square(): IsEqual<TWidth, THeight> {
		const { width, height } = this;
		// @ts-ignore No overlap isn't a problem in this case.
		return width === height;
	}

	/**
	 * @throws When the rectangle is not a square.
	 */
	public to_square(): ToSquare<TWidth, THeight> {
		const { is_square, width, height } = this;
		if (is_square) return new Square(width) as ToSquare<TWidth, THeight>;
		throw new TypeError(
			`Rectangle's width (${width}) and height (${height}) are not same - cannot convert to square`,
		);
	}
}

type Stringified<TWidth extends number, THeight extends number> = `Rectangle (${TWidth} x ${THeight})`;

type HalfRectangle<TDimension extends RectangleDimensionName | undefined = undefined> =
	TDimension extends RectangleDimensionName ? number : [number, number];

type ToSquare<TWidth extends number, THeight extends number> = IsEqual<TWidth, THeight> extends true
	? Square<TWidth>
	: never;

if (import.meta.vitest) {
	const { describe, expectTypeOf, test } = import.meta.vitest;

	describe(Rectangle.name, () => {
		describe("constructor", () => {
			test("throws when a negative dimension provided", ({ expect }) => {
				expect(() => new Rectangle(-1, 0)).toThrowErrorMatchingInlineSnapshot(
					"[ValiError: Invalid value: Expected >=0 but received -1]",
				);
			});

			test("works on non-negative dimensions provided", ({ expect }) => {
				expect(() => new Rectangle(0, 0)).not.toThrowError(v.ValiError);
				expectTypeOf(new Rectangle(0, 0)).toEqualTypeOf<Rectangle<0, 0>>();
			});
		});

		test("get aspect_ratio", ({ expect }) => {
			const { aspect_ratio } = new Rectangle(13.37, 1337);
			expect(aspect_ratio).toBe(0.01);
			expectTypeOf(aspect_ratio).toEqualTypeOf(0.01);
		});

		describe("half(dimension?)", () => {
			const rectangle = new Rectangle(10, 5);

			test("works when no argument with dimension name provided", ({ expect }) => {
				const half = rectangle.half();
				expect(half).toStrictEqual([5, 2.5]);
				expectTypeOf(half).toEqualTypeOf<[number, number]>();
			});

			test("works when 'width' argument provided", ({ expect }) => {
				const half_width = rectangle.half("width");
				expect(half_width).toBe(5);
				expectTypeOf(half_width).toEqualTypeOf<number>();
			});

			test("works when 'height' argument provided", ({ expect }) => {
				const half_height = rectangle.half("height");
				expect(half_height).toBe(2.5);
				expectTypeOf(half_height).toEqualTypeOf<number>();
			});
		});

		describe("get is_square", () => {
			test("returns 'true' when valid", ({ expect }) => {
				const { is_square } = new Rectangle(1337, 1337);
				expect(is_square).toBe(true);
				expectTypeOf(is_square).toEqualTypeOf(true);
			});

			test("returns 'false' when invalid", ({ expect }) => {
				const { is_square } = new Rectangle(13.37, 1337);
				expect(is_square).toBe(false);
				expectTypeOf(is_square).toEqualTypeOf(false);
			});
		});

		describe("to_square()", () => {
			test("throws when doesn't meet square constraints", ({ expect }) => {
				expect(() => new Rectangle(1337, 3).to_square()).toThrowErrorMatchingInlineSnapshot(
					`[TypeError: Rectangle's width (1337) and height (3) are not same - cannot convert to square]`,
				);
			});

			test("returns a Square when valid", ({ expect }) => {
				const square = new Rectangle(1337, 1337).to_square();
				expect(square).toBeInstanceOf(Square);
				expectTypeOf(square).toEqualTypeOf<Square<1337>>();
			});
		});

		test("get perimeter", ({ expect }) => {
			const { perimeter } = new Rectangle(3, 9);
			expect(perimeter).toBe(24);
			expectTypeOf(perimeter).toEqualTypeOf<number>();
		});

		test("get area", ({ expect }) => {
			const { area } = new Rectangle(3, 9);
			expect(area).toBe(27);
			expectTypeOf(area).toEqualTypeOf<number>();
		});
	});
}
