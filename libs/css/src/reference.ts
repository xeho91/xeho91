import type { Display } from "@xeho91/lib-type/trait/display";
import type { Identifier } from "css-tree";

import type { ToAST } from "#ast";
import { AtProperty } from "#at-rule/property";
import { Var } from "#function/var";
import { Property } from "#property";
import type { Syntax } from "#syntax";
import type { Value } from "#value";

type Prefix = typeof Reference.PREFIX;

export class Reference<TName extends string = string> implements Display, ToAST {
	public static readonly PREFIX = "--";

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public toString(): Stringified<TName> {
		return `${Reference.PREFIX}${this.name}` as Stringified<TName>;
	}

	/*@__NO_SIDE_EFFECTS__*/
	public to_ast(): Identifier {
		return {
			type: "Identifier",
			name: this.toString(),
		};
	}

	public to_property(): Property<typeof this> {
		return new Property(this);
	}

	public to_at_property<TSyntax extends Syntax, TInitialValue extends Value, TInherits extends boolean>(properties: {
		syntax: TSyntax;
		initial_value: TInitialValue;
		inherits: TInherits;
	}): AtProperty<typeof this, TSyntax, TInitialValue, TInherits> {
		return new AtProperty(this, properties);
	}

	public to_var<TFallback extends ConstructorParameters<typeof Var>[1]>(
		fallback?: TFallback,
	): Var<typeof this, TFallback> {
		return new Var(this, fallback);
	}

	public add_prefix<Prefix extends string | number>(prefix: Prefix) {
		return new Reference(`${prefix}-${this.name}`);
	}

	public add_suffix<Suffix extends string | number>(suffix: Suffix) {
		return new Reference(`${this.name}-${suffix}`);
	}
}

type Stringified<Name extends string> = `${Prefix}${Name}`;

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe("toString()", () => {
		it("returns the name with prefix of two dashes", ({ expect }) => {
			const name = "text-color-alpha";
			const instance = new Reference(name);
			const stringified = instance.toString();

			expect(stringified).toBe(`--${name}`);
			expectTypeOf(stringified).toEqualTypeOf<"--text-color-alpha">();
		});
	});

	describe("add_prefix(p)", () => {
		it("returns the instance correctly with prefix", ({ expect }) => {
			const current = new Reference("color-primary-9");
			const withPrefix = current.add_prefix("text");
			const expected = "text-color-primary-9";
			expect(withPrefix.name).toBe(expected);
			expectTypeOf(withPrefix).toEqualTypeOf<Reference<typeof expected>>();
		});
	});

	describe("add_suffix(s)", () => {
		it("returns the instance correctly with suffix", ({ expect }) => {
			const current = new Reference("color-secondary-1");
			const withPrefix = current.add_suffix("lightness");
			const expected = "color-secondary-1-lightness";
			expect(withPrefix.name).toBe(expected);
			expectTypeOf(withPrefix).toEqualTypeOf<Reference<typeof expected>>();
		});
	});
}
