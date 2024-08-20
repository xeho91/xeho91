/**
 * Snippets related to using JavaScript {@link String}.
 * @module
 */

/**
 * Convert first letter of string to uppercase.
 * @param input string
 * @returns Stringified input where the first letter is uppercased.
 */
export function capitalize<T extends string>(input: T): Capitalize<T> {
	return (input[0]?.toUpperCase() + input.slice(1)) as Capitalize<T>;
}

if (import.meta.vitest) {
	const { describe, it, expectTypeOf } = import.meta.vitest;

	describe(capitalize.name, () => {
		it("should return a string with first char uppercased", ({ expect }) => {
			const capitalized = capitalize("xeho91");
			const expected = "Xeho91";
			expect(capitalized).toBe(expected);
			expectTypeOf(capitalized).toBeString();
			expectTypeOf(capitalized).toEqualTypeOf<typeof expected>();
		});

		it("doesn't transform if first char is a number", ({ expect }) => {
			const capitalized = capitalize("19ohex");
			const expected = "19ohex";
			expect(capitalized).toBe(expected);
			expectTypeOf(capitalized).toBeString();
			expectTypeOf(capitalized).toEqualTypeOf<typeof expected>();
		});
	});
}
