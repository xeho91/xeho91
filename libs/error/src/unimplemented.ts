/**
 * Inspired by Rust's [`unimplemented!`](https://doc.rust-lang.org/std/macro.unimplemented.html).
 * @module
 *
 * @example
 * ```ts
 * import { unimplemented } from "@xeho91/lib-error/unimplemented";
 *
 * let featureIncomplete;
 *
 * if (!featureIncomplete) {
 *     throw unimplemented("Submit a feature request.");
 * }
 * ```
 */

import type { AnyFunction } from "@xeho91/lib-type/function";

export class UnimplementedError extends Error {
	constructor(message: string, asserter: AnyFunction | undefined = undefined) {
		super(message, {
			cause: "UNIMPLEMENTED",
		});
		this.name = "UnimplementedError";
		Error.captureStackTrace?.(this, asserter || this.constructor);
	}

	public override toString(): string {
		return `[${this.cause}] ${this.message}`;
	}
}

/**
 * @see {@link UnimplementedError}
 *
 * @param message Optional. Preferably describing a hint of what can be done, if occurred at runtime.
 */
export function unimplemented(message = "Reached a case which was not yet implemented!"): UnimplementedError {
	return new UnimplementedError(message);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(unimplemented.name, () => {
		it("works when no 'message' in argument passed", ({ expect }) => {
			expect(() => {
				throw unimplemented();
			}).toThrowErrorMatchingInlineSnapshot(
				"[UnimplementedError: Reached a case which was not yet implemented!]",
			);
		});

		it("works with 'message' passed to first argument", ({ expect }) => {
			expect(() => {
				throw unimplemented("I'll finish it one day");
			}).toThrowErrorMatchingInlineSnapshot(`[UnimplementedError: I'll finish it one day]`);
		});
	});
}
