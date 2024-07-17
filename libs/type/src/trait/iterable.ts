/**
 * Reusable type aliases, helpers or abstract classes for `Iterable` trait _(interface)_.
 * Uses built-in {@link Symbol.iterator}.
 * @module
 */

import type { Display } from "#trait/display";

/**
 * Abstract class to speed up development of iterable instance.
 *
 * @example
 *
 * ```ts
 * import type { IterableInstance } from "@xeho91/lib-type/trait/iterable";
 *
 * type FruitName = "🍎" | "🍌" | "🍊";
 * export class Fruits<const TFruits extends FruitName[]> extends IterableInstance<FruitName> {
 *    protected iterable: TFruits;
 *
 *    constructor(fruits: TFruits) {
 *        super();
 *        this.iterable = fruits;
 *    }
 *
 *    public get list() {
 *        return this.instance;
 *    }
 * }
 *
 * const likeable_fruits = new Fruits(["🍌", "🍎"]);
 *
 * for (const fruit of likeable_fruits) {
 *     console.log(fruit);
 * }
 * // ^ Log: "🍌"
 * // ^ Log: "🍎"
 *
 * likeable_fruits.size;
 * //              ^ 2
 *
 * likeable_fruits.is_empty;
 * //              ^ false
 * ```
 *
 * const non_likeable_fruits = new Fruits([]);
 *
 * non_likeable_fruits.size;
 * //                  ^ 0
 *
 * non_likeable_fruits.is_empty;
 * //                  ^ true
 * ```
 */
export abstract class IterableInstance<T> implements Iterable<T>, Display {
	/**
	 * Iterable instance to wrap with this abstract class
	 * @see {@link Symbol.iterator}.
	 */
	protected abstract iterable: Iterable<T>;

	/**
	 * Allows using for loop on instance.
	 * @see {@link Symbol.iterator}.
	 */
	public [Symbol.iterator](): Iterator<T> {
		return this.iterable[Symbol.iterator]();
	}

	/**
	 * Get the size of wrapped iterable.
	 *
	 * NOTE: Works when is an {@link Array} too.
	 *
	 * @throws {TypeError} when it doesn't recognize an iterable type.
	 */
	public get size(): number {
		const { iterable } = this;
		if (Array.isArray(iterable)) return iterable.length;
		if ("size" in iterable && typeof iterable.size === "number") return iterable.size;
		throw new TypeError("Unrecognized iterable size, cannot get size");
	}

	/**
	 * Get the size of wrapped iterable.
	 *
	 * NOTE: Works when is an {@link Array} too.
	 */
	public get is_empty(): boolean {
		return this.size === 0;
	}

	/**
	 * @see {@link Display}
	 */
	public abstract toString(): string;
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(IterableInstance.name, () => {
		class TestArray extends IterableInstance<number> {
			protected iterable: number[];
			constructor(arr: number[]) {
				super();
				this.iterable = arr;
			}
			public get arr() {
				return this.iterable;
			}
			public toString(): string {
				return "";
			}
		}
		class TestSet extends IterableInstance<number> {
			protected iterable: Set<number>;
			constructor(set: Set<number>) {
				super();
				this.iterable = set;
			}
			public get set() {
				return this.iterable;
			}
			public toString(): string {
				return "";
			}
		}
		class TestMap extends IterableInstance<[string, number]> {
			protected iterable: Map<string, number>;
			constructor(map: Map<string, number>) {
				super();
				this.iterable = map;
			}
			public get map() {
				return this.iterable;
			}
			public toString(): string {
				return "";
			}
		}

		const iterable_arr = new TestArray([1, 2, 3]);
		const iterable_set = new TestSet(new Set([1, 2, 3]));
		const iterable_map = new TestMap(
			new Map([
				["a", 1],
				["b", 2],
				["c", 3],
			]),
		);

		describe("constructor", () => {
			it("works for class wrapping array", ({ expect }) => {
				expect(iterable_arr.arr).toBeInstanceOf(Array);
				expectTypeOf(iterable_arr.arr).toEqualTypeOf<number[]>();
			});

			it("works for class wrapping set", ({ expect }) => {
				expect(iterable_set.set).toBeInstanceOf(Set);
				expect(iterable_set.size).toBe(3);
				expectTypeOf(iterable_set.set).toEqualTypeOf<Set<number>>();
			});

			it("works for class wrapping map", ({ expect }) => {
				expect(iterable_map.map).toBeInstanceOf(Map);
				expectTypeOf(iterable_map.map).toEqualTypeOf<Map<string, number>>();
			});
		});

		describe("[Symbol.iterator]()", () => {
			it("iterates over an iterable correctly", ({ expect }) => {
				for (const number of iterable_arr) {
					expect(number).toBeTypeOf("number");
				}
				for (const number of iterable_set) {
					expect(number).toBeTypeOf("number");
				}
				for (const [_, number] of iterable_map) {
					expect(number).toBeTypeOf("number");
				}
			});
		});

		describe("get size", () => {
			it("works for known JavaScript built-in iterables", ({ expect }) => {
				expectTypeOf(iterable_arr.size).toEqualTypeOf<number>();
				expect(iterable_arr.size).toBe(3);
				expect(iterable_set.size).toBe(3);
				expect(iterable_map.size).toBe(3);
			});
		});

		describe("get is_empty", () => {
			it("returns false on non-empty iterable", ({ expect }) => {
				expectTypeOf(iterable_arr.is_empty).toEqualTypeOf<boolean>();
				expect(iterable_arr.is_empty).toBe(false);
				expect(iterable_set.is_empty).toBe(false);
				expect(iterable_map.is_empty).toBe(false);
			});

			it("returns true on empty iterable", ({ expect }) => {
				expect(new TestArray([]).is_empty).toBe(true);
				expect(new TestSet(new Set()).is_empty).toBe(true);
				expect(new TestMap(new Map()).is_empty).toBe(true);
			});
		});
	});
}
