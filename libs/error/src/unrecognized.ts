import type { AnyFunction } from "@xeho91/lib-type/function";
import type { Primitive } from "type-fest/source/primitive";

/**
 * Comes in handy for example when using a `switch` statement, and providing a case that has been unrecognized.
 */
export class UnrecognizedError<TCase extends Primitive> extends Error {
	/** A primitive value which caused the error. */
	public readonly case: Primitive;

	constructor(message: string, _case: TCase, asserter: AnyFunction | undefined = undefined) {
		super(message, {
			cause: "UNRECOGNIZED",
		});
		this.name = "UnrecognizedError";
		Error.captureStackTrace?.(this, asserter || this.constructor);
	}

	public override toString() {
		return `[${this.cause} - { ${this.case?.toString()} }] ${this.message}`;
	}
}

/**
 * @see {@link UnrecognizedError}
 *
 * @param _case A primitive value which caused the error.
 *
 * @example
 * ```
 * import { unrecognized } from "@xeho91/lib-error/unrecognized";
 *
 * switch(letter) {
 *     case "a": return "a is nice";
 *     case "b": return "b is good";
 *     case "c": return "c is meh";
 *     default: throw unrecognized(letter);
 * }
 * ```
 */
export function unrecognized<Case extends Primitive>(_case: Case, message?: string | undefined) {
	return new UnrecognizedError(message ?? `An unrecognized case { ${_case?.toString()} } has occurred!`, _case);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(unrecognized.name, () => {
		it("works when providing a case as argument that was unrecognized", ({ expect }) => {
			expect(() => {
				throw unrecognized("who-are-you");
			}).toThrowErrorMatchingInlineSnapshot(
				"[UnrecognizedError: An unrecognized case { who-are-you } has occurred!]",
			);
		});
	});
}
