import type { Display } from "@xeho91/lib-type/trait/display";
import * as v from "valibot";

/**
 * A numeric range with a specified minimum, maximum, and default step.
 *
 * @template TMin - minimum value
 * @template TMax - maximum value
 *
 * @param min - minimum value
 * @param max - maximum value
 */
export class Range<TMin extends number = number, TMax extends number = number>
	implements Iterable<number>, Display<Stringified<TMin, TMax>>
{
	#min: TMin;
	#max: TMax;
	#step: number;

	static #parse_min = (min: number) => v.parse(v.number(), min);
	static #parse_max = (min: number, max: number) =>
		v.parse(v.pipe(v.number(), v.notValue(min), v.minValue(min)), max);

	/**
	 * @param min - minimum value
	 * @param max - maximum value
	 * @param step - defaults to 1% between min and max
	 */
	constructor(min: TMin, max: TMax, step?: number) {
		this.#min = Range.#parse_min(min) as TMin;
		this.#max = Range.#parse_max(min, max) as TMax;
		this.#step = step ?? (max - min) * 0.01;
	}

	public toString(): Stringified<TMin, TMax> {
		return `Range (${this.#min}..${this.#max})`;
	}

	public get min() {
		return this.#min;
	}

	public set min(value: TMin) {
		this.#min = Range.#parse_min(value) as TMin;
	}

	public get max() {
		return this.#max;
	}

	public set max(value: TMax) {
		this.#max = Range.#parse_max(this.min, value) as TMax;
	}

	public get step() {
		return this.#step;
	}

	public set step(value: number) {
		this.#step = value;
	}

	public [Symbol.iterator]() {
		const { min, max, step } = this;
		let value = min as number;
		return {
			next: () => {
				if (value <= max) {
					const result = { value, done: false } as const;
					value += step;
					return result;
				}
				return { value: undefined, done: true } as const;
			},
		};
	}

	/**
	 * Check if a provided value is within the range.
	 */
	public is_in(value: number): boolean {
		const { min, max } = this;
		return min <= value && value <= max;
	}
}

type Stringified<TMin extends number, TMax extends number> = `Range (${TMin}..${TMax})`;

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(Range.name, () => {
		describe("constructor", () => {
			it("throws error when min and max are equal", ({ expect }) => {
				expect(() => new Range(0, 0)).toThrowErrorMatchingInlineSnapshot(
					"[ValiError: Invalid value: Expected !0 but received 0]",
				);
			});
			it("throws error when min is greater than max", ({ expect }) => {
				expect(() => new Range(10, 0)).toThrowErrorMatchingInlineSnapshot(
					"[ValiError: Invalid value: Expected >=10 but received 0]",
				);
			});
			it("returns instance when values matches constraints", ({ expect }) => {
				expect(new Range(1, 100)).toBeInstanceOf(Range);
			});
		});

		describe("get step", () => {
			it("by default step is one percent between min and max", ({ expect }) => {
				expect(new Range(5, 95).step).toBe(0.9);
			});
		});

		describe("set step", () => {
			it("it allows mutating step to existing range", ({ expect }) => {
				const range = new Range(5, 95);
				range.step = 1;
				expect(range.step).toBe(1);
			});
		});

		describe("toString()", () => {
			it("returns pretty string", ({ expect }) => {
				const range = new Range(5, 95);
				expect(range.toString()).toMatchInlineSnapshot(`"Range (5..95)"`);
				expectTypeOf(range.toString()).toEqualTypeOf<"Range (5..95)">();
			});
		});

		describe("[Symbol.iterator]()", () => {
			it("iterates correctly from min to max, based on default step", ({ expect }) => {
				const range = new Range(0, 100);
				let current_value = range.min;
				const values = [];
				for (const current_step of range) {
					expect(current_step).toBe(current_value);
					values.push(current_step);
					current_value += range.step;
				}
				expect(values.length).toBe(101);
			});

			it("iterates correctly from min to max, based on manually set step", ({ expect }) => {
				const range = new Range(0, 100, 5);
				let current_value = range.min;
				const values = [];
				for (const current_step of range) {
					expect(current_step).toBe(current_value);
					values.push(current_step);
					current_value += range.step;
				}
				expect(values.length).toBe(21);
			});
		});

		describe("is_in(value)", () => {
			it("returns 'true' when provided value fits range", ({ expect }) => {
				const range = new Range(0, 100);
				expect(range.is_in(50)).toBe(true);
			});

			it("returns 'false' when provided value is out of range", ({ expect }) => {
				const range = new Range(0, 100);
				expect(range.is_in(101)).toBe(false);
			});

			it("returns 'true' when provided value is equal to min or max", ({ expect }) => {
				const range = new Range(0, 100);
				expect(range.is_in(0)).toBe(true);
				expect(range.is_in(100)).toBe(true);
			});
		});
	});
}
