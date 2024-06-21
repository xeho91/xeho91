/**
 * Snippets related to using {@link Set}.
 * @module
 */

import type { IterableElement } from "type-fest/source/iterable-element";

export function extract_set_elements<
	// biome-ignore lint/suspicious/noExplicitAny: This is intentional
	const TCurrentSet extends ReadonlySet<any> | Set<any>,
	const TToExtract extends readonly IterableElement<TCurrentSet>[],
>(current_set: TCurrentSet, to_extract: TToExtract): Set<Extract<IterableElement<TCurrentSet>, TToExtract[number]>> {
	// TODO: Use `Set.difference()`
	const new_set = new Set<Extract<IterableElement<TCurrentSet>, TToExtract[number]>>();

	for (const key of current_set) {
		if (to_extract.includes(key)) {
			new_set.add(key);
		}
	}

	return new_set;
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(extract_set_elements.name, () => {
		it("returns correctly a new set with keys to be extracted", ({ expect }) => {
			const set = new Set([1, 2, 3, 4, 5, 6] as const);
			const to_extract = [4, 5, 6] as const;
			extract_set_elements(new Set([1, 2] as const), [2]);
			const extracted = extract_set_elements(set, to_extract);

			expect(extracted).toHaveLength(to_extract.length);
			expectTypeOf(extracted).toEqualTypeOf<Set<4 | 5 | 6>>();

			for (const key of to_extract) {
				expect(extracted).toContainEqual(key);
			}
		});
	});
}

export function exclude_set_elements<
	// biome-ignore lint/suspicious/noExplicitAny: This is intentional
	const TCurrentSet extends Set<any> | ReadonlySet<any>,
	const TToExclude extends readonly IterableElement<TCurrentSet>[],
>(current_set: TCurrentSet, to_exclude: TToExclude): Set<Exclude<IterableElement<TCurrentSet>, TToExclude[number]>> {
	// TODO: Use `Set.difference()`
	const new_set = current_set as Set<Exclude<IterableElement<TCurrentSet>, TToExclude[number]>>;

	for (const item of to_exclude) {
		new_set.delete(item as IterableElement<typeof new_set>);
	}

	return new_set;
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(exclude_set_elements.name, () => {
		it("returns correctly a new set with keys to be excluded", ({ expect }) => {
			const set = new Set([1, 2, 3, 4, 5, 6] as const);
			const to_exclude = [4, 5, 6] as const;
			const excluded = exclude_set_elements(set, to_exclude);

			expect(excluded).toHaveLength(to_exclude.length);
			expectTypeOf(excluded).toEqualTypeOf<Set<1 | 2 | 3>>();

			for (const key of to_exclude) {
				expect(excluded).not.toContainEqual(key);
			}
		});
	});
}
