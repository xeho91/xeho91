/**
 * Inspired by Rust's [`unreachable!`](https://doc.rust-lang.org/std/macro.unreachable.html)
 * Usually used to help TypeScript understand that the code path should never be reached.
 * @module
 *
 * @example
 * ```ts
 * import { unreachable } from "@xeho91/lib-error/unreachable";
 *
 * if (!aConditionThatNeverHappens) {
 *     throw unreachable("Should never happen at runtime.");
 * }
 * ```
 */

import type { AnyFunction } from "@xeho91/lib-type/function";

export class UnreachableError extends Error {
	constructor(message: string, asserter: AnyFunction | undefined = undefined) {
		super(message, {
			cause: "UNREACHABLE",
		});
		this.name = "UnreachableError";
		Error.captureStackTrace?.(this, asserter || this.constructor);
	}

	public override toString(): string {
		return `[${this.cause}] ${this.message}`;
	}
}

/**
 * @see {@link UnreachableError}
 *
 * @param message Optional message preferably describing a **reason** of the unreachability.
 */
export function unreachable(message = "An unreachable case has occurred!"): UnreachableError {
	return new UnreachableError(message);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(unreachable.name, () => {
		it("works when no 'message' in argument passed", ({ expect }) => {
			expect(() => {
				throw unreachable();
			}).toThrowErrorMatchingInlineSnapshot("[UnreachableError: An unreachable case has occurred!]");
		});

		it("works with 'message' passed to first argument", ({ expect }) => {
			expect(() => {
				throw unreachable("This should never happen, but it did anyway!");
			}).toThrowErrorMatchingInlineSnapshot("[UnreachableError: This should never happen, but it did anyway!]");
		});
	});
}
