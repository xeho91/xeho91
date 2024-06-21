/**
 * Snippets related to using {@link Number}.
 * @module
 */

interface RoundingOptions {
	/** @default 2 */
	decimals?: number;
}

/** Round number **UP** to specified decimals length. */
export function round_up(n: number, options: RoundingOptions = {}): number {
	const { decimals = 2 } = options;
	const rounded = Math.round(Number(`${n}e${decimals}`));
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

/** Round number **DOWN** to specified decimals length. */
export function round_down(value: number, options: RoundingOptions = {}): number {
	const { decimals = 2 } = options;
	const parsed = Number.parseFloat(`${value}e${decimals}`);
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
