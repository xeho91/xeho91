/**
 * Snippets related to using {@link Number}.
 * @module
 */

import crypto from "node:crypto";

interface RandomOptions {
	/**
	 * Specify a maximum allowed number.
	 * @default {@link Number.MAX_SAFE_INTEGER}
	 */
	max?: number;
	/**
	 *
	 * Specify a minimum allowed number.
	 * @default {@link Number.MIN_SAFE_INTEGER}
	 */
	min?: number;
}

/**
 * Get a random **integer** number from the specified range.
 * @param options {@link RandomOptions}
 */
export function get_random_integer(options: RandomOptions = {}): number {
	const { max = Number.MAX_SAFE_INTEGER, min = Number.MIN_SAFE_INTEGER } = options;

	const random = get_safe_random_number();
	return Math.floor(random * (max - min + 1) + min);
}

function get_safe_random_number(): number {
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

interface RoundingOptions {
	/**
	 * Number of decimals to round to.
	 * @default 2
	 */
	decimals?: number;
}

/**
 * Round number **UP** to specified decimals length.
 * @param number target number
 * @param options {@link RoundingOptions}
 */
export function round_up(number: number, options: RoundingOptions = {}): number {
	const { decimals = 2 } = options;
	const rounded = Math.round(Number(`${number}e${decimals}`));
	return Number(`${rounded}e-${decimals}`);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(round_up.name, () => {
		it("rounds up correctly to default decimals", ({ expect }) => {
			expect(round_up(1234.456789)).toEqual(1234.46);
			expect(round_up(-0.001)).toEqual(0);
			expect(round_up(0.001)).toEqual(0);
		});
	});
}

/**
 * Round number **DOWN** to specified decimals length.
 * @param number target number
 * @param options {@link RoundingOptions}
 */
export function round_down(number: number, options: RoundingOptions = {}): number {
	const { decimals = 2 } = options;
	const parsed = Number.parseFloat(`${number}e${decimals}`);
	const floored = Math.floor(parsed);
	return Number(`${floored}e-${decimals}`);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(round_down.name, () => {
		it("rounds down correctly to default decimals", ({ expect }) => {
			expect(round_down(1234.456789)).toEqual(1234.45);
			expect(round_down(-0.001)).toEqual(-0.01);
			expect(round_down(0.001)).toEqual(0);
		});
	});
}
