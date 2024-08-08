import type { GreaterThanOrEqual, IsEqual } from "@xeho91/lib-type/eq";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";
import * as v from "valibot";

import { Circle } from "#two-dimension/circle";
import { TwoDimensionalFigure } from "#two-dimension/mod";

export type EllipseAxisName = IterableElement<typeof Ellipse.AXES>;

export class Ellipse<TAxisX extends number = number, TAxisY extends number = number>
	extends TwoDimensionalFigure
	implements Display<Stringified<TAxisX, TAxisY>>
{
	static readonly #AXES = ["x", "y"] as const;
	public static readonly AXES = Object.freeze(new Set(Ellipse.#AXES));

	public readonly axis_x: TAxisX;
	public readonly axis_y: TAxisY;

	/**
	 * @throws When one of the arguments is less than or equal to 0.
	 */
	constructor(radius_x: TAxisX, radius_y: TAxisY) {
		super();
		const schema = v.pipe(v.number(), v.minValue(0));
		this.axis_x = v.parse(schema, radius_x) as TAxisX;
		this.axis_y = v.parse(schema, radius_y) as TAxisY;
	}

	public toString(): Stringified<TAxisX, TAxisY> {
		return `Ellipse (x: ${this.axis_x}, y: ${this.axis_y})`;
	}

	public get aspect_ratio(): number {
		const { axis_x, axis_y } = this;
		return axis_x / axis_y;
	}

	public half<TAxis extends EllipseAxisName | undefined = undefined>(axis?: TAxis): HalfEllipse<TAxis> {
		const { axis_x, axis_y } = this;
		if (axis) return (this[`axis_${axis}`] / 2) as HalfEllipse<TAxis>;
		return [axis_x / 2, axis_y / 2] as HalfEllipse<TAxis>;
	}

	public get is_circle(): IsEqual<TAxisX, TAxisY> {
		const { axis_x, axis_y } = this;
		// @ts-ignore No overlap isn't a problem in this case.
		return axis_x === axis_y;
	}

	/**
	 * @throws When the rectangle is not a square.
	 */
	public to_circle(): ToCircle<TAxisX, TAxisY> {
		const { is_circle, axis_x, axis_y } = this;
		// @ts-ignore FIXME: Need to figure out where there's instantiation loop
		if (is_circle) return new Circle(axis_x) as ToCircle<TAxisX, TAxisY>;
		throw new TypeError(`Ellipse's axis x (${axis_x}) and y (${axis_y}) are not same - cannot convert to circle`);
	}

	public get major_axis(): MajorAxis<TAxisX, TAxisY> {
		const { axis_x, axis_y } = this;
		return (axis_x > axis_y ? axis_x : axis_y) as MajorAxis<TAxisX, TAxisY>;
	}

	public get minor_axis(): MinorAxis<TAxisX, TAxisY> {
		const { axis_x, axis_y } = this;
		return (axis_x > axis_y ? axis_y : axis_x) as MinorAxis<TAxisX, TAxisY>;
	}

	public get perimeter(): number {
		const { major_axis, minor_axis } = this;
		const h_numerator = (major_axis - minor_axis) ** 2;
		const h_denominator = (major_axis + minor_axis) ** 2;
		const h = h_numerator / h_denominator;
		const second_factor = major_axis + minor_axis;
		const third_factor_numerator = 3 * h;
		const third_factor_denominator = 10 + Math.sqrt(4 - 3 * h);
		const third_factor = 1 + third_factor_numerator / third_factor_denominator;
		return Math.PI * second_factor * third_factor;
	}

	public get area(): number {
		const { major_axis, minor_axis } = this;
		return Math.PI * major_axis * minor_axis;
	}
}

type Stringified<TAxisX extends number, TAxisY extends number> = `Ellipse (x: ${TAxisX}, y: ${TAxisY})`;

// biome-ignore lint/suspicious/noExplicitAny: Intentional.
export type EllipseLike = Ellipse<any, any>;

type HalfEllipse<TAxis extends EllipseAxisName | undefined = undefined> = TAxis extends EllipseAxisName
	? number
	: [number, number];

type MajorAxis<TAxisX extends number = number, TAxisY extends number = number> = GreaterThanOrEqual<
	TAxisX,
	TAxisY
> extends true
	? TAxisX
	: TAxisY;

type MinorAxis<TAxisX extends number = number, TAxisY extends number = number> = GreaterThanOrEqual<
	TAxisY,
	TAxisX
> extends true
	? TAxisX
	: TAxisY;

type ToCircle<TAxisX extends number, TAxisY extends number> = IsEqual<TAxisX, TAxisY> extends true
	? Circle<TAxisX>
	: never;

if (import.meta.vitest) {
	const { describe, expectTypeOf, test } = import.meta.vitest;

	describe(Ellipse.name, () => {
		describe("constructor", () => {
			test("throws when a negative dimension provided", ({ expect }) => {
				expect(() => new Ellipse(-1, 0)).toThrowErrorMatchingInlineSnapshot(
					"[ValiError: Invalid value: Expected >=0 but received -1]",
				);
			});

			test("works on non-negative dimensions provided", ({ expect }) => {
				expect(() => new Ellipse(0, 0)).not.toThrowError(v.ValiError);
				expectTypeOf(new Ellipse(0, 0)).toEqualTypeOf<Ellipse<0, 0>>();
			});
		});

		test("get aspect_ratio", ({ expect }) => {
			const { aspect_ratio } = new Ellipse(13.37, 1337);
			expect(aspect_ratio).toBe(0.01);
			expectTypeOf(aspect_ratio).toEqualTypeOf(0.01);
		});

		describe("half(dimension?)", () => {
			const ellipse = new Ellipse(10, 5);

			test("works when no argument with dimension name provided", ({ expect }) => {
				const half = ellipse.half();
				expect(half).toStrictEqual([5, 2.5]);
				expectTypeOf(half).toEqualTypeOf<[number, number]>();
			});

			test("works when 'x' argument provided", ({ expect }) => {
				const half = ellipse.half("x");
				expect(half).toBe(5);
				expectTypeOf(half).toEqualTypeOf<number>();
			});

			test("works when 'y' argument provided", ({ expect }) => {
				const half = ellipse.half("y");
				expect(half).toBe(2.5);
				expectTypeOf(half).toEqualTypeOf<number>();
			});
		});

		describe("get is_circle", () => {
			test("returns 'true' on valid circle", ({ expect }) => {
				const { is_circle } = new Ellipse(1337, 1337);
				expect(is_circle).toBe(true);
				expectTypeOf(is_circle).toEqualTypeOf(true);
			});

			test("returns 'false' on invalid circle", ({ expect }) => {
				const { is_circle } = new Ellipse(13.37, 1337);
				expect(is_circle).toBe(false);
				expectTypeOf(is_circle).toEqualTypeOf(false);
			});
		});

		describe("to_circle()", () => {
			test("throws when doesn't meet circle constraints", ({ expect }) => {
				expect(() => new Ellipse(1337, 3).to_circle()).toThrowErrorMatchingInlineSnapshot(
					`[TypeError: Ellipse's axis x (1337) and y (3) are not same - cannot convert to circle]`,
				);
			});

			test("returns a Circle when valid", ({ expect }) => {
				const circle = new Ellipse(1337, 1337).to_circle();
				expect(circle).toBeInstanceOf(Circle);
				expectTypeOf(circle).toEqualTypeOf<Circle<1337>>();
			});
		});

		test("get perimeter", ({ expect }) => {
			const { perimeter } = new Ellipse(3, 9);
			expect(perimeter).toBe(40.09467833948016);
			expectTypeOf(perimeter).toEqualTypeOf<number>();
		});

		test("get area", ({ expect }) => {
			const { area } = new Ellipse(3, 9);
			expect(area).toBe(84.82300164692441);
			expectTypeOf(area).toEqualTypeOf<number>();
		});
	});
}
