/**
 * Snippets related to using {@link Array}.
 * @module
 */

import type { Join, JoinableItem } from "type-fest/source/join";

/**
 * @see {@link quoteify_array}
 */
export type QuoteifyArray<TArray extends Array<JoinableItem> | ReadonlyArray<JoinableItem>> = {
	[TKey in keyof TArray]: TArray[TKey] extends string ? `"${TArray[TKey]}"` : TArray[TKey];
};

/**
 * Wrap every **element with a string type as value** in array in double quotes.
 *
 * @example
 * ```ts
 * import { quoteify_array } from "@xeho91/lib-snippet/array";
 *
 * const array = [100, "foo", false, 10n, null, undefined] as const;
 * const results = quoteify_array(array);
 * //.   ^ [100, '"foo"', false, 10n, null, undefined];
 * ```
 */
export function quoteify_array<
	TElement extends JoinableItem,
	const TArray extends Array<TElement> | ReadonlyArray<TElement>,
>(array: TArray) {
	return array.map((v) => (typeof v === "string" ? `"${v}"` : v)) as QuoteifyArray<TArray>;
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(quoteify_array.name, () => {
		it("returns a new array with double quoted string-like elements", ({ expect }) => {
			const array = [100, "foo", false, 10n, null, undefined] as const;
			const results = quoteify_array(array);

			expect(results).toStrictEqual([100, '"foo"', false, 10n, null, undefined]);
			expectTypeOf(results).toEqualTypeOf<QuoteifyArray<typeof array>>();
			expectTypeOf(results).toEqualTypeOf<readonly [100, '"foo"', false, 10n, null, undefined]>();
		});

		it("returns same array without string-like elements", ({ expect }) => {
			const array = [100, false, 10n, null, undefined] as const;
			const results = quoteify_array(array);

			expect(results).toStrictEqual(array);
			expectTypeOf(results).toEqualTypeOf<typeof array>();
		});
	});
}

/**
 * Create from readonly array a **stringified** union type.
 * Usually used for documentation purpose.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types}
 * @example
 * ```ts
 * import { stringified_union_from_array } from "@xeho91/lib-snippet/array";
 *
 * const array = [100, "foo", false, 10n, null, undefined] as const;
 * const results = stringified_union_from_array(array);
 * //.   ^  '100 | "foo" | false | 10n | null | undefined'
 * ```
 */
export function stringified_union_from_array<TElement extends JoinableItem, const TArray extends readonly TElement[]>(
	array: TArray,
) {
	const joinText = " | ";
	return quoteify_array(array).join(joinText) as Join<QuoteifyArray<TArray>, typeof joinText>;
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	describe(stringified_union_from_array.name, () => {
		it("returns a stringified union from an array", ({ expect }) => {
			const array = [1, "foo", false];

			expect(stringified_union_from_array(array)).toBe('1 | "foo" | false');
		});
	});
}

/**
 * ‘Zips up’ two arrays into a single array of pairs.
 * @param left array
 * @param right array
 * @throws when arrays do not have same length
 *
 * @example
 * ```ts
 * import { zip_arrays } from "@xeho91/lib-snippet/array";
 *
 * const left = ["🥚", "🌶", "🥵"] as const;
 * const right = ["🐓", "🍍", "🥶"] as const;
 * const results = zip_arrays(left, right);
 * //.   ^ [
 * //.       ["🥚", "🐓"],
 * //.       ["🌶", "🍍"],
 * //.       ["🥵", "🥶"]
 * //.     ];
 * ```
 */
export function zip_arrays<const Left, const Right>(
	left: readonly Left[],
	right: readonly Right[],
): Array<[Left, Right]> {
	if (left.length !== right.length) {
		throw new TypeError("Arrays must have the same length");
	}

	return left.map((value, index) => [value, right[index]]) as Array<[Left, Right]>;
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(zip_arrays.name, () => {
		it("throws error when arrays do not have same length", ({ expect }) => {
			const left = [1, "foo", false, 1n];
			const right = [2, "bar", true];

			expect(() => zip_arrays(left, right)).toThrowErrorMatchingInlineSnapshot(
				"[TypeError: Arrays must have the same length]",
			);
		});

		it("it returns correctly a zipped array", ({ expect }) => {
			const left = [1, "foo", false] as const;
			const right = [2, "bar", true] as const;

			expect(zip_arrays(left, right)).toEqual([
				[1, 2],
				["foo", "bar"],
				[false, true],
			]);
		});
	});
}
