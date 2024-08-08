/**
 * Comes in handy for example when using a `switch` statement, and providing a case that has been unrecognized.
 * @module
 *
 * @example
 * ```ts
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

import type { AnyFunction } from "@xeho91/lib-type/function";
import type { Primitive } from "@xeho91/lib-type/primitive";

export class UnrecognizedError<TCase extends Primitive> extends Error {
	/** A primitive value which caused the error. */
	public readonly case: Primitive;

	constructor(case_: TCase, message: string | undefined = undefined, asserter: AnyFunction | undefined = undefined) {
		const stringified_case = typeof case_ === "string" ? `"${case_}"` : case_?.toString();
		super(message ?? `An unrecognized case { ${stringified_case} } has occurred!`, {
			cause: "UNRECOGNIZED",
		});
		this.case = case_;
		this.name = "UnrecognizedError";
		Error.captureStackTrace?.(this, asserter || this.constructor);
	}

	public override toString(): string {
		return `[${this.cause}] ${this.message}`;
	}
}

/**
 * @see {@link UnrecognizedError}
 *
 * @param case_ A primitive value which caused the error.
 * @param message Override a default message.
 */
export function unrecognized<TCase extends Primitive = Primitive>(
	case_: TCase,
	message?: ConstructorParameters<typeof UnrecognizedError>[1],
): UnrecognizedError<TCase> {
	return new UnrecognizedError(case_, message);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(unrecognized.name, () => {
		it("works when providing a case as argument that was unrecognized", ({ expect }) => {
			expect(() => {
				throw unrecognized("who-are-you");
			}).toThrowErrorMatchingInlineSnapshot(
				`[UnrecognizedError: An unrecognized case { "who-are-you" } has occurred!]`,
			);
		});
	});
}
