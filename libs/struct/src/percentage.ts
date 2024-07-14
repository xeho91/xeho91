import type { NewTypeStruct } from "@xeho91/lib-type/struct";
import type { Display } from "@xeho91/lib-type/trait/display";
import * as v from "valibot";

export class Percentage<TActual extends number = number, TTotal extends number = number>
	implements NewTypeStruct<number>, Display<Stringified>
{
	#actual: TActual;
	#total: TTotal;

	static #parse_total = (total: number) => v.parse(v.pipe(v.number(), v.notValue(0)), total);

	constructor(actual: TActual, total: TTotal) {
		this.#actual = actual;
		this.#total = Percentage.#parse_total(total) as TTotal;
	}

	public valueOf(): number {
		return (this.actual / this.#total) * 100;
	}

	public toString(): Stringified {
		return `${this.valueOf()}%`;
	}

	public get actual(): TActual {
		return this.#actual;
	}

	public set actual(actual: number) {
		this.#actual = actual as TActual;
	}

	public get total(): TTotal {
		return this.#total;
	}

	public set total(total: number) {
		this.#total = Percentage.#parse_total(total) as TTotal;
	}

	public get decimal(): number {
		return this.valueOf() / 100;
	}
}

type Stringified = `${number}%`;

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(Percentage.name, () => {
		describe("constructor", () => {
			it("works when provided actual is zero", ({ expect }) => {
				expect(new Percentage(0, 1)).toBeInstanceOf(Percentage);
			});

			it("throws error when provided total is zero", ({ expect }) => {
				expect(() => new Percentage(1, 0)).toThrowErrorMatchingInlineSnapshot(
					"[ValiError: Invalid value: Expected !0 but received 0]",
				);
			});
		});

		describe("valueOf", () => {
			it("returns correctly a percentage number", ({ expect }) => {
				expect(new Percentage(10, 100).valueOf()).toBe(10);
				expect(new Percentage(1, 50).valueOf()).toBe(2);
				expect(new Percentage(-13.37, 1337).valueOf()).toBe(-1);
			});

			it("works with negative numbers", ({ expect }) => {
				expect(new Percentage(-13.37, 1337).valueOf()).toBe(-1);
			});
		});

		describe("toString()", () => {
			it("returns stringified value", ({ expect }) => {
				expect(new Percentage(10, 100).toString()).toBe("10%");
			});
		});

		describe("set actual", () => {
			it("works with any kind of number", ({ expect }) => {
				const percent = new Percentage(1, 1);
				percent.actual = -100.132123;
				expect(percent.actual).toBe(-100.132123);
			});
		});

		describe("set total", () => {
			it("throws error when attempting to set total to zero", ({ expect }) => {
				const percent = new Percentage(1, 1);
				expect(() => {
					percent.total = 0;
				}).toThrowErrorMatchingInlineSnapshot("[ValiError: Invalid value: Expected !0 but received 0]");
			});

			it("works when total value isn't zero", ({ expect }) => {
				const percent = new Percentage(1, 1);
				percent.total = -100;
				expect(percent.total).toBe(-100);
			});
		});

		describe("get decimal", () => {
			it("returns correctly a decimal number", ({ expect }) => {
				const { decimal } = new Percentage(13.37, 1991);
				expect(decimal).toBe(0.006715218483174284);
			});
		});
	});
}
