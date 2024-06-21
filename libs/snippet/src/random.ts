/**
 * Snippets related to generating random number values.
 * @module
 */

import crypto from "node:crypto";

interface RandomNumberOptions {
	/** @default {@link Number.MAX_SAFE_INTEGER} */
	max?: number;
	/** @default {@link Number.MIN_SAFE_INTEGER} */
	min?: number;
}

/**
 * Get a random **integer** number from the specified range.
 * @param options - range options
 */
export function get_random_integer(options: RandomNumberOptions = {}) {
	const { max = Number.MAX_SAFE_INTEGER, min = Number.MIN_SAFE_INTEGER } = options;

	const random = get_safe_random_number();
	return Math.floor(random * (max - min + 1) + min);
}

function get_safe_random_number() {
	const random = crypto.getRandomValues(new Uint32Array(1)).at(0) as number;
	/**
	 * NOTE: `0xff_ff_ff_ff` aka (`0xFFFFFFF`) - Uint32 max value represent in hexadecimal format
	 * NOTE:  `+1` - because Math.random is inclusive of 0, but not 1
	 * Ref: https://stackoverflow.com/a/62792582
	 */
	return random / (0xff_ff_ff_ff + 1);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const { pretty_json } = await import("#json");

	describe(get_random_integer.name, () => {
		it("returns integer without options", ({ expect }) => {
			const int = get_random_integer();

			expect(int).toBeTypeOf("number");
			expect(Number.isInteger(int)).toBe(true);
		});

		it("every new generated integer number is NOT same as previous one", ({ expect }) => {
			let cached = 0;

			for (let index = 0; index < 1000; index++) {
				const int = get_random_integer();

				expect(int).toBeTypeOf("number");
				expect(Number.isInteger(int)).toBe(true);
				expect(int).not.toEqual(cached);

				cached = int;
			}
		});

		const options = { min: 1, max: 10 } as const;

		it(`returns a random integer number in range with options - ${pretty_json(options)}`, ({ expect }) => {
			for (let index = 0; index < 100; index++) {
				const int = get_random_integer(options);

				expect(int).toBeGreaterThanOrEqual(options.min);
				expect(int).toBeLessThanOrEqual(options.max);
			}
		});
	});
}
