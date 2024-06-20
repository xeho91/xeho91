/**
 * Reusable type aliases or helpers for {@link Set}
 *
 * @module set
 */

/**
 * Infer the type of keys from a strongly typed {@link Set} or {@link ReadonlySet}.
 *
 * @example
 * ```
 * import type { SetKeys } from "";
 *
 * const fruits = new Set(["🍎", "🍌", "🍉"] as const);
 * type Fruit = SetKeys<typeof fruits>;
 * //.  ^  "🍎" | "🍌" | "🍉"
 * ```
 */
export type SetKeys<TSetOrReadonlySet extends Set<unknown> | ReadonlySet<unknown>> =
	TSetOrReadonlySet extends ReadonlySet<infer Keys> ? Keys : TSetOrReadonlySet extends Set<infer Keys> ? Keys : never;

if (import.meta.vitest) {
	const { expectTypeOf, test } = import.meta.vitest;

	test("SetKeys", () => {
		const fruits = new Set(["🍎", "🍌", "🍉"] as const);

		type Fruit = SetKeys<typeof fruits>;

		expectTypeOf<"🍎">().toMatchTypeOf<Fruit>();
		expectTypeOf<"🍌">().toMatchTypeOf<Fruit>();
		expectTypeOf<"🍉">().toMatchTypeOf<Fruit>();

		type VegetableSet = Set<"🥦" | "🥕" | "🌶">;
		type Vegetable = SetKeys<VegetableSet>;

		expectTypeOf<Vegetable>().toEqualTypeOf<"🥦" | "🥕" | "🌶">();

		type UserRolesSet = ReadonlySet<"regular" | "contributor" | "maintainer">;
		type UserRole = SetKeys<UserRolesSet>;

		expectTypeOf<UserRole>().toEqualTypeOf<"regular" | "contributor" | "maintainer">();
	});
}
