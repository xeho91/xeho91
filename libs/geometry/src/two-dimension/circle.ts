import type { Display } from "@xeho91/lib-type/trait/display";
import * as v from "valibot";

import { Ellipse } from "#two-dimension/ellipse";
import { TwoDimensionalFigure } from "#two-dimension/mod";
import { Square } from "#two-dimension/square";

export class Circle<TRadius extends number = number>
	extends TwoDimensionalFigure
	implements Display<Stringified<TRadius>>
{
	public readonly radius: TRadius;

	constructor(radius: TRadius) {
		super();
		const schema = v.pipe(v.number(), v.minValue(0));
		this.radius = v.parse(schema, radius) as TRadius;
	}

	public toString(): Stringified<TRadius> {
		return `Circle (radius: ${this.radius})`;
	}

	public override get aspect_ratio(): 1 {
		return 1;
	}

	public override half(): number {
		return this.radius / 2;
	}

	public override get perimeter(): number {
		return 2 * Math.PI * this.radius;
	}

	public override get area(): number {
		return Math.PI * this.radius ** 2;
	}

	public to_ellipse(): Ellipse<TRadius, TRadius> {
		const { radius } = this;
		return new Ellipse(radius, radius);
	}

	public to_square(): Square {
		return new Square(this.radius * 2);
	}
}

type Stringified<TRadius extends number> = `Circle (radius: ${TRadius})`;

if (import.meta.vitest) {
	const { describe, expectTypeOf, test } = import.meta.vitest;

	describe(Circle.name, () => {
		test("get aspect_ratio", ({ expect }) => {
			const { aspect_ratio } = new Circle(1337);
			expect(aspect_ratio).toBe(1);
			expectTypeOf(aspect_ratio).toEqualTypeOf<1>();
		});

		test("get perimeter", ({ expect }) => {
			const { perimeter } = new Circle(1337);
			expect(perimeter).toBe(8400.618755699106);
			expectTypeOf(perimeter).toEqualTypeOf<number>();
		});

		test("get area", ({ expect }) => {
			const { area } = new Circle(10);
			expect(area).toBe(314.1592653589793);
			expectTypeOf(area).toEqualTypeOf<number>();
		});

		test("to_ellipse()", ({ expect }) => {
			const circle = new Circle(10);
			const ellipse = circle.to_ellipse();
			expect(ellipse).toBeInstanceOf(Ellipse);
			expectTypeOf(ellipse).toEqualTypeOf<Ellipse<10, 10>>();
			expect(ellipse.axis_x).toBe(10);
			expect(ellipse.axis_y).toBe(10);
		});

		test("to_square()", ({ expect }) => {
			const circle = new Circle(10);
			const square = circle.to_square();
			expect(square).toBeInstanceOf(Square);
			expectTypeOf(square).toEqualTypeOf<Square>();
			expect(square.size).toBe(20);
		});
	});
}
