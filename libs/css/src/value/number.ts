import type { Display } from "@xeho91/lib-type/trait/display";
import type { NumberNode } from "css-tree";

import type { ToAST } from "#ast";
import { Syntax } from "#syntax";
import { type ToValue, Value } from "#value";

export class NumberCSS<TValue extends number = number> implements Display, ToAST, ToValue {
	public static readonly SYNTAX = new Syntax("number");

	public value: TValue;

	constructor(value: TValue) {
		this.value = value;
	}

	public get syntax(): typeof NumberCSS.SYNTAX {
		return NumberCSS.SYNTAX;
	}

	public toString(): Stringified<TValue> {
		return `${this.value}`;
	}

	public to_value(): Value<[typeof this]> {
		return new Value(this);
	}

	/*@__NO_SIDE_EFFECTS__*/
	public to_ast(): NumberNode {
		return {
			type: "Number",
			value: this.toString(),
		};
	}
}

type Stringified<TValue extends number> = `${TValue}`;
