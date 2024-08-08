import type { Display } from "@xeho91/lib-type/trait/display";
import type { Identifier } from "css-tree";

import type { ToAST } from "#ast";
import { type ToValue, Value } from "#value";

export class BooleanCSS<TValue extends boolean = boolean> implements Display, ToAST, ToValue {
	public value: TValue;

	constructor(value: TValue) {
		this.value = value;
	}

	public toString(): Stringified<TValue> {
		return `${this.value}`;
	}

	public to_ast(): Identifier {
		const { value } = this;
		return {
			type: "Identifier",
			name: value.toString(),
		};
	}

	public to_value(): Value<[typeof this]> {
		return new Value(this);
	}
}

type Stringified<TValue extends boolean> = `${TValue}`;
