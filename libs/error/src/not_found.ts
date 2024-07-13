/**
 * Comes in handy when trying to access a inexistent value - for example `None`, `undefined` or `null`.
 * @module
 *
 * @example
 * ```ts
 * import { not_found } from "@xeho91/lib-error/not-found";
 *
 * let x: string | undefined;
 *
 * if (!x) {
 *   throw not_found(x);
 * }
 * ```
 */

import type { AnyFunction } from "@xeho91/lib-type/function";

export class NotFoundError<TVariable extends string = string> extends Error {
	public readonly variable_name: TVariable;

	constructor(
		variable_name: TVariable,
		message: string | undefined = undefined,
		asserter: AnyFunction | undefined = undefined,
	) {
		super(
			message ?? `A variable { ${variable_name} } was not found - it was either 'None', 'null' or 'undefined'`,
			{
				cause: "NOT_FOUND",
			},
		);
		this.variable_name = variable_name;
		this.name = "NotFoundError";
		Error.captureStackTrace?.(this, asserter || this.constructor);
	}

	public override toString(): string {
		return `[${this.cause}] - ${this.message}`;
	}
}

/**
 * @see {@link NotFoundError}
 *
 * @param variable_name A primitive value which caused the error.
 * @param message Override a default message.
 */
export function not_found<TVariableName extends string = string>(
	variable_name: TVariableName,
	message?: ConstructorParameters<typeof NotFoundError>[1],
): NotFoundError<TVariableName> {
	return new NotFoundError(variable_name, message);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(not_found.name, () => {
		it("works when providing a variable name as argument that was not found", ({ expect }) => {
			expect(() => {
				throw not_found("who-are-you");
			}).toThrowErrorMatchingInlineSnapshot(
				`[NotFoundError: A variable { who-are-you } was not found - it was either 'None', 'null' or 'undefined']`,
			);
		});
	});
}
