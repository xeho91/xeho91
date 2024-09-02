/**
 * Snippets related to using {@link Set}.
 * @module
 */

import type { IterableElement } from "@xeho91/lib-type/iterable";

/**
 * Create a new set from an existing one with entries to be **extracted**.
 * @param current_set Current set to extract entries from
 * @param to_extract Entries _(values)_ to extract from the current set
 *
 * @example
 * ```ts
 * import { extract_set_entries } from "@xeho91/lib-snippet/set";
 *
 * const set = new Set([1, 2, 3, 4, 5, 6] as const);
 * const results = extract_set_entries(set, [1, 2, 3]);
 * //.   ^ new Set<1 | 2 | 3>();
 * ```
 */
export function extract_set_entries<
	// biome-ignore lint/suspicious/noExplicitAny: This is intentional
	const TCurrentSet extends ReadonlySet<any> | Set<any>,
	const TToExtract extends readonly IterableElement<TCurrentSet>[],
>(current_set: TCurrentSet, to_extract: TToExtract): Set<Extract<IterableElement<TCurrentSet>, TToExtract[number]>> {
	return current_set.intersection(new Set(to_extract));
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(extract_set_entries.name, () => {
		it("returns correctly a new set with keys to be extracted", ({ expect }) => {
			const set = new Set([1, 2, 3, 4, 5, 6] as const);
			const to_extract = [4, 5, 6] as const;
			extract_set_entries(new Set([1, 2] as const), [2]);
			const extracted = extract_set_entries(set, to_extract);
			expect(extracted).toHaveLength(to_extract.length);
			expectTypeOf(extracted).toEqualTypeOf<Set<4 | 5 | 6>>();
			for (const key of to_extract) expect(extracted).toContainEqual(key);
		});
	});
}

/**
 * Create a new set from an existing one with entries to be **excluded**.
 * @param current_set Current set to exclude entries from
 * @param to_exclude Entries _(values)_ to exclude from the current set
 *
 * @example
 * ```ts
 * import { exclude_set_entries } from "@xeho91/lib-snippet/set";
 *
 * const set = new Set([1, 2, 3, 4, 5, 6] as const);
 * const results = exclude_set_entries(set, [1, 2, 3]);
 * //.   ^ new Set<4 | 5 | 6>();
 * ```
 */
export function exclude_set<
	// biome-ignore lint/suspicious/noExplicitAny: This is intentional
	const TCurrentSet extends Set<any> | ReadonlySet<any>,
	const TToExclude extends readonly IterableElement<TCurrentSet>[],
>(current_set: TCurrentSet, to_exclude: TToExclude): Set<Exclude<IterableElement<TCurrentSet>, TToExclude[number]>> {
	return current_set.difference(new Set(to_exclude));
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(exclude_set.name, () => {
		it("returns correctly a new set with keys to be excluded", ({ expect }) => {
			const set = new Set([1, 2, 3, 4, 5, 6] as const);
			const to_exclude = [4, 5, 6] as const;
			const excluded = exclude_set(set, to_exclude);
			expect(excluded).toHaveLength(to_exclude.length);
			expectTypeOf(excluded).toEqualTypeOf<Set<1 | 2 | 3>>();
			for (const key of to_exclude) expect(excluded).not.toContainEqual(key);
		});
	});
}

/**
 * Create typed {@link ReadonlySet}
 * @param items array of items to be included in readonly set
 */
export function readonly_set<const Items extends unknown[]>(items: Items): ReadonlySet<Items[number]> {
	// TODO: Create a custom readonly set instance to prevent adding new items
	return Object.freeze(new Set(items));
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(readonly_set.name, () => {
		it("returns typed readonly set from random items", ({ expect }) => {
			const set = readonly_set([1, 2, 3, "four", null, true]);
			expect(set).toBeInstanceOf(Set);
			expect(Object.isFrozen(set)).toBe(true);
			expectTypeOf(set).toEqualTypeOf<ReadonlySet<1 | 2 | 3 | "four" | null | true>>();
		});
	});
}

/**
 * Create a single sets with unionized items from as many sets as you wish
 * @param sets to unionize
 */
export function unionize_sets<T>(...sets: (Set<T> | ReadonlySet<T>)[]): Set<T> {
	let first = sets[0] as Set<T>;
	// @ts-ignore FIXME: `svelte-check` is not happy
	for (let index = 1; index < sets.length; index++) first = first.union(sets[index] as Set<T>);
	return first;
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(unionize_sets.name, () => {
		it("returns a single set correctly with unionized items", ({ expect }) => {
			const set1 = new Set([1, 2, 3] as const);
			const set2 = readonly_set([3, 4, 5]);
			const unionized = unionize_sets(set1, set2);
			expect(unionized).toBeInstanceOf(Set);
			for (const item of [1, 2, 3, 4, 5] as const) {
				expect(unionized.has(item)).toBe(true);
				expectTypeOf(unionized).toEqualTypeOf<Set<1 | 2 | 3 | 4 | 5>>();
			}
		});
	});
}
