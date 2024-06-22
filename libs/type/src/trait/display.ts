/**
 * Reusable type aliases or helpers for `Display` trait.
 * Uses built-in {@link Object.prototype.toString()} method on JavaScript instances.
 * @module
 */

/**
 * Enforce a custom instance to return a stringified _(strongly typed)_ representation.
 *
 * @example
 *
 * ```ts
 * import type { Display } from "@xeho91/lib-type/trait/display";
 *
 * export class Token<TName extends string> implements Display<TName> {
 *    #name: TName;
 *
 *    constructor(name: TName) {
 *        this.#name = name;
 *    }
 *
 *    public toString() {
 *        return this.#name.toString();
 *    }
 * }
 *
 * const token = new Token("xeho91");
 * const stringified = token.toString();
 * //.   ^ "xeho91"
 * ```
 */
export interface Display<TString extends string = string> {
	/**
	 * Return a stringified representation of this instance.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString#overriding_tostring_for_custom_objects}
	 */
	toString(): TString;
}

/**
 * Return an union of stringified values from instances which implements {@link Display} trait _(interface)_.
 *
 * @example
 * ```ts
 * import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
 *
 * class Chicken implements Display<"🐓"> {
 *     public toString() {
 *         return "🐓" as const;
 *     }
 * }
 *
 * class Egg implements Display<"🥚"> {
 *     public toString() {
 *         return "🥚" as const;
 *     }
 * }
 *
 * type Stringified = InferDisplays<[Chicken, Egg]>;
 * //.  ^ ["🐓", "🥚"]
 * ```
 */
export type InferDisplays<TDisplay extends Display<string>[] = Display<string>[]> = {
	[TItem in keyof TDisplay]: ReturnType<TDisplay[TItem]["toString"]>;
};

if (import.meta.vitest) {
	const { expectTypeOf, test } = import.meta.vitest;

	test("Display", () => {
		expectTypeOf<Display<"test">>().toEqualTypeOf<{
			toString(): "test";
		}>();
		expectTypeOf<Display<"test">>().not.toEqualTypeOf<{
			toString(): string;
		}>();
	});
}

if (import.meta.vitest) {
	const { expectTypeOf, test } = import.meta.vitest;

	class Test1 implements Display<"test1"> {
		public toString() {
			return "test1" as const;
		}
	}
	class Test2 implements Display<"test2"> {
		public toString() {
			return "test2" as const;
		}
	}

	const stringified = `${new Test1().toString()}, ${new Test2().toString()}` as const;

	test("InferDisplays", () => {
		expectTypeOf<InferDisplays<[Test1, Test2]>>().toEqualTypeOf<["test1", "test2"]>();
		expectTypeOf(stringified).toEqualTypeOf("test1, test2" as const);
		expectTypeOf(stringified).not.toEqualTypeOf<string>();
	});
}

/**
 * A type utility to extract the stringified value from instance
 * which has the {@link Display} trait _(`implements Display`)_.
 *
 * @example
 * ```ts
 * import type { Display, ToString } from "@xeho91/lib-type/trait/display";
 *
 * class Test<T extends string> implements Display<T> {
 *     constructor(value: T) {
 *         this.value = value;
 *     }
 *
 *     public toString() {
 *         return this.value;
 *     }
 * }
 *
 * type Stringified = ToString<Test<"xeho91">>;
 * //.  ^ "xeho91"
 * ```
 */
export type ToString<TDisplay extends Display = Display> = ReturnType<TDisplay["toString"]>;

if (import.meta.vitest) {
	const { expectTypeOf, test } = import.meta.vitest;

	class Test implements Display<"test"> {
		public toString() {
			return "test" as const;
		}
	}

	test("ToString", () => {
		expectTypeOf<ToString<Test>>().toEqualTypeOf<"test">();
		expectTypeOf(new Test().toString()).toEqualTypeOf("test" as const);
		expectTypeOf(new Test().toString()).not.toEqualTypeOf<string>();
	});
}
