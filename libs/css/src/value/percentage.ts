import { Percentage as PercentageStruct } from "@xeho91/lib-struct/percentage";
import type { Percentage as PercentageAST } from "css-tree";

import type { ToAST } from "#ast";
import { Syntax } from "#syntax";
import { type ToValue, Value } from "#value";

export class Percentage<TValue extends number = number> extends PercentageStruct implements ToAST, ToValue {
	public static readonly SYNTAX = new Syntax("percentage");

	public value: TValue;

	constructor(value: TValue) {
		super(value / 100);
		this.value = value;
	}

	public override toString(): `${TValue}%` {
		const { value } = this;
		return `${value}%`;
	}

	public get syntax(): Syntax<"percentage"> {
		return Percentage.SYNTAX;
	}

	public to_ast(): PercentageAST {
		return {
			type: "Percentage",
			value: this.toString(),
		};
	}

	public to_value(): Value<[typeof this]> {
		return new Value(this);
	}
}

if (import.meta.vitest) {
	const { describe, it, expectTypeOf } = import.meta.vitest;

	describe(Percentage.name, () => {
		describe("get syntax", () => {
			it("returns correct syntax", ({ expect }) => {
				const { syntax } = new Percentage(50);
				expect(syntax).toBeInstanceOf(Syntax);
				expect(syntax.name).toBe("percentage");
				expectTypeOf(syntax).toEqualTypeOf<Syntax<"percentage">>();
			});
		});

		describe("toString()", () => {
			it("returns typed stringified", ({ expect }) => {
				const percentage = new Percentage(50);
				const stringified = percentage.toString();
				expect(stringified).toBe("50%");
				expectTypeOf(stringified).toEqualTypeOf<"50%">();
			});
		});
	});
}
