/**
 * Reusable type aliases or helpers for {@link Function}
 *
 * @module function
 */

/**
 * Use instead of {@link Function}
 *
 * @see {@link https://www.totaltypescript.com/dont-use-function-keyword-in-typescript}
 */
// biome-ignore lint/suspicious/noExplicitAny: Intentional, for typing purpose
export type AnyFunction = (...args: any[]) => any;

if (import.meta.vitest) {
	const { describe, expectTypeOf } = import.meta.vitest;

	describe("AnyFunction", () => {
		expectTypeOf<AnyFunction>().not.toBeAny();
		// biome-ignore lint/suspicious/noExplicitAny: Intentional
		expectTypeOf<AnyFunction>().toEqualTypeOf<(...args: any[]) => any>();
	});
}
