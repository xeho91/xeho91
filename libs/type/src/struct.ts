/**
 * Types for custom instances.
 * They should provide `valueOf()` method that returns the wrapped value of instance.
 * @module
 *
 * @see {@link Object.prototype.valueOf()}
 */

import type { Primitive } from "type-fest/source/primitive";

/**
 * Inspired from Rust,
 * it's called _"newtype"_ because it allows to create a new type that is distinct from its underlying type,
 * providing type safety or compatibility.
 */
export interface NewTypeStruct<Value extends Primitive = Primitive> {
	/**
	 * Return the wrapped value type of this instance.
	 * @see {@link Object.prototype.valueOf()}
	 */
	valueOf(): Value;
}

/**
 * This instance is a wrapper for Key Value struct (2 items tuple).
 */
export interface KeyValueStruct<
	Key extends symbol | string | number = symbol | string | number,
	Value extends Primitive = Primitive,
> {
	key: Key;
	value: Value;
	/**
	 * Return the wrapped value type of this instance (2 items tuple).
	 * @see {@link Object.prototype.valueOf()}
	 */
	valueOf(): [Key, Value];
}

/**
 * This instance should have a constant/fixed value.
 */
export interface UnitStruct<Value extends Primitive = Primitive> {
	/**
	 * Return the constant/fixed value of this instance.
	 * @see {@link Object.prototype.valueOf()}
	 */
	valueOf(): Value;
}

/**
 * A type utility to infer the wrapped value _(return type of `valueOf() method`)_ from pre-defined kind of structs.
 *
 * @see {@link Object.prototype.valueOf()}
 *
 * ## Supported structs
 *
 * - {@link NewTypeStruct}
 * - {@link KeyValueStruct}
 * - {@link UnitStruct}
 *
 * @example
 * ```js
 * import type { ValueOf } from "@xeho91/lib-type/struct";
 *
 * class Pi implements UnitStruct<typeof Pi["VALUE"]> {
 *     private readonly static VALUE = 3.14 as const;
 *
 *     public valueOf() {
 *         return Pi.VALUE;
 *     }
 * }
 *
 * type PiValue = ValueOf<Pi>;
 * //.  ^ 3.14
 * ```
 */
export type ValueOf<TStruct extends NewTypeStruct | KeyValueStruct | UnitStruct> = ReturnType<TStruct["valueOf"]>;

if (import.meta.vitest) {
	const { expectTypeOf, test } = import.meta.vitest;

	test("ValueOf", () => {
		class Pi implements UnitStruct<(typeof Pi)["VALUE"]> {
			private static readonly VALUE = 3.14 as const;

			public valueOf() {
				return Pi.VALUE;
			}
		}

		expectTypeOf<ValueOf<Pi>>().toEqualTypeOf<3.14>();
		expectTypeOf<ValueOf<Pi>>().not.toEqualTypeOf<number>();
	});
}
