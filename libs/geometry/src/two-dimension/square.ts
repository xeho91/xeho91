import type { Display } from "@xeho91/lib-type/trait/display";
import * as v from "valibot";

import { Circle } from "#two-dimension/circle";
import { TwoDimensionalFigure } from "#two-dimension/mod";
import { Rectangle } from "#two-dimension/rectangle";

export class Square<TSize extends number = number> extends TwoDimensionalFigure implements Display<Stringified<TSize>> {
	#size: TSize;

	constructor(size: TSize) {
		super();
		const schema = v.pipe(v.number(), v.minValue(0));
		this.#size = v.parse(schema, size) as TSize;
	}

	public toString(): Stringified<TSize> {
		const { size } = this;
		return `Square (${size} x ${size})`;
	}

	public get size(): TSize {
		return this.#size;
	}

	public set size(side: TSize) {
		this.#size = side;
	}

	public override get aspect_ratio(): 1 {
		return 1;
	}

	public override half(): number {
		return this.#size / 2;
	}

	public override get perimeter(): number {
		return this.#size * 4;
	}

	public override get area(): number {
		return this.#size ** 2;
	}

	public to_circle(): Circle {
		return new Circle(this.#size / 2);
	}

	public to_rectangle(): Rectangle<TSize, TSize> {
		const { size } = this;
		return new Rectangle(size, size);
	}
}

type Stringified<TSize extends number> = `Square (${TSize} x ${TSize})`;

if (import.meta.vitest) {
	const { describe, expectTypeOf, test } = import.meta.vitest;

	describe(Square.name, () => {
		test("get aspect_ratio", ({ expect }) => {
			const { aspect_ratio } = new Square(1337);
			expect(aspect_ratio).toBe(1);
			expectTypeOf(aspect_ratio).toEqualTypeOf<1>();
		});

		test("get perimeter", ({ expect }) => {
			const { perimeter } = new Square(1337);
			expect(perimeter).toBe(5348);
			expectTypeOf(perimeter).toEqualTypeOf<number>();
		});

		test("get area", ({ expect }) => {
			const { area } = new Square(1337);
			expect(area).toBe(1787569);
			expectTypeOf(area).toEqualTypeOf<number>();
		});

		test("to_circle()", ({ expect }) => {
			const square = new Square(1337);
			const circle = square.to_circle();
			expect(circle).toBeInstanceOf(Circle);
			expectTypeOf(circle).toEqualTypeOf<Circle>();
			expect(circle.radius).toBe(668.5);
		});

		test("to_rectangle()", ({ expect }) => {
			const square = new Square(1337);
			const rectangle = square.to_rectangle();
			expect(rectangle).toBeInstanceOf(Rectangle);
			expectTypeOf(rectangle).toEqualTypeOf<Rectangle<1337, 1337>>();
			expect(rectangle.width).toBe(1337);
			expect(rectangle.height).toBe(1337);
		});
	});
}
