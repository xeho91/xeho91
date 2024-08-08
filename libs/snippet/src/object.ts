/**
 * Snippets related to using JavaScript {@link Object}.
 * @module
 */

import type { Entries } from "@xeho91/lib-type/iterable";
import type { ObjectEntries } from "@xeho91/lib-type/object";

/**
 * Get the typed object entries.
 * @param object - object from whose you want to return it's entries as typed array.
 */
export function object_entries<const TObject extends object>(object: TObject) {
	return Object.entries(object) as Entries<TObject>;
}

/**
 * Get the typed object keys.
 * @param object - object from whose you want to return it's keys as typed array.
 */
export function object_keys<const TObject extends object>(object: TObject) {
	return Object.keys(object) as (keyof TObject)[];
}

export function readonly_object<const TObject extends object>(object: TObject) {
	return Object.freeze(object);
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(object_keys.name, () => {
		it("returns an array of object keys and matches the expected type", ({ expect }) => {
			const input = {
				key1: 1337,
				key2: 2023,
			} as const;

			expect(object_keys(input)).toEqual(Object.keys(input));
			expectTypeOf(object_keys(input)).toEqualTypeOf<Array<"key1" | "key2">>();
		});
	});
}

/**
 * Create a new object with only specified entries based selected keys.
 * @param object target object
 * @param keys array of object keys whose entries you want
 * @example
 * ```ts
 * import { pick } from "@xeho91/lib-snippet/object";
 *
 * const object = { apple: "🍎", banana: "🍌", pear: "🍐" } as const;
 * const results = pick(object, ["apple", "pear"]);
 * //.   ^ { apple: "🍎", pear: "🍐" }
 * ```
 */
export function pick<const TObject extends object, const Keys extends keyof TObject>(
	object: TObject,
	keys: Keys[],
): Pick<TObject, Keys> {
	const keysSet = new Set(keys);
	const entries = Object.entries(object) as Array<[Keys, TObject[Keys]]>;
	const filtered = entries.filter(([key]) => keysSet.has(key));

	return Object.fromEntries(filtered) as Pick<TObject, Keys>;
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(object_entries.name, () => {
		it("returns an array of object entries and matches the expected type", ({ expect }) => {
			const input = {
				key1: 1337,
				key2: 2023,
			} as const;

			expect(object_entries(input)).toEqual(Object.entries(input));
			expectTypeOf(object_entries(input)).toEqualTypeOf<ObjectEntries<typeof input>>();
		});
	});
}
