/**
 * Snippets related to using JavaScript {@link Object}.
 * @module
 */

import type { Entries, ObjectEntries } from "type-fest/source/entries";

/**
 * Get the typed object entries.
 * @param object - object from whose you want to return it's entries as typed array.
 */
export function typed_object_entries<const TObject extends object>(object: TObject) {
	return Object.entries(object) as Entries<TObject>;
}

/**
 * Get the typed object keys.
 * @param object - object from whose you want to return it's keys as typed array.
 */
export function typed_object_keys<const T extends object>(object: T) {
	return Object.keys(object) as (keyof T)[];
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(typed_object_keys.name, () => {
		it("returns an array of object keys and matches the expected type", ({ expect }) => {
			const input = {
				key1: 1337,
				key2: 2023,
			} as const;

			expect(typed_object_keys(input)).toEqual(Object.keys(input));
			expectTypeOf(typed_object_keys(input)).toEqualTypeOf<Array<"key1" | "key2">>();
		});
	});
}

export function pick<const Object extends object, Keys extends keyof Object>(object: Object, keys: Keys[]) {
	const keysSet = new Set(keys);
	const entries = Object.entries(object) as Array<[Keys, Object[Keys]]>;
	const filtered = entries.filter(([key]) => keysSet.has(key));

	return Object.fromEntries(filtered) as Pick<Object, Keys>;
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(typed_object_entries.name, () => {
		it("returns an array of object entries and matches the expected type", ({ expect }) => {
			const input = {
				key1: 1337,
				key2: 2023,
			} as const;

			expect(typed_object_entries(input)).toEqual(Object.entries(input));
			expectTypeOf(typed_object_entries(input)).toEqualTypeOf<ObjectEntries<typeof input>>();
		});
	});
}
