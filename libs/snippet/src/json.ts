/**
 * Snippets related to using {@link JSON}.
 * @module
 */

/**
 * Print JSON data with an indentation for better readability.
 * @param data - a valid JSON-compatible data.
 * @throws When invalid JSON syntax was used _(for example `undefined`)_
 */
export function pretty_json(data: unknown): string {
	if (data === undefined) {
		throw TypeError("Data must be a valid JSON syntax.");
	}

	return JSON.stringify(data, undefined, 2);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(pretty_json.name, () => {
		it("throws error on the invalid JSON syntaxes", ({ expect }) => {
			expect(() => pretty_json(undefined)).toThrowErrorMatchingInlineSnapshot(
				"[TypeError: Data must be a valid JSON syntax.]",
			);
		});

		it("succeeds on the valid JSON syntaxes", ({ expect }) => {
			expect(() => pretty_json("hello")).not.toThrowError();
			expect(() => pretty_json(1337)).not.toThrowError();
			expect(() => pretty_json(null)).not.toThrowError();
			expect(() => pretty_json("null")).not.toThrowError();
			expect(() => pretty_json(["hello", 1337])).not.toThrowError();
			expect(() =>
				pretty_json({
					hello: "world",
					awesomeness: 1337,
				}),
			).not.toThrowError();
		});

		it("it doesn't include entries with 'undefined' values", ({ expect }) => {
			const special = { x: undefined };

			expect(() => pretty_json(special)).not.toThrowError();
			expect(pretty_json(special)).toBe("{}");
		});
	});
}
