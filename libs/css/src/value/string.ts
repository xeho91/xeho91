import type { Display } from "@xeho91/lib-type/trait/display";
import type { StringNode } from "css-tree";

import type { ToAST } from "#ast";
import { type ToValue, Value } from "#value";

export class StringCSS<TValue extends string = string> implements Display, ToAST, ToValue {
	public value: TValue;

	constructor(value: TValue) {
		this.value = value;
	}

	public toString(): Stringified<TValue> {
		return `"${this.value}"`;
	}

	/*@__NO_SIDE_EFFECTS__*/
	public to_ast(): StringNode {
		const { value } = this;
		return {
			type: "String",
			value,
		};
	}

	public to_value(): Value<[typeof this]> {
		return new Value(this);
	}
}

type Stringified<TValue extends string> = `"${TValue}"`;
