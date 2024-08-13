import type { Display } from "@xeho91/lib-type/trait/display";
import type { Identifier as IdentifierAST } from "css-tree";

import type { ToAST } from "#ast";
import { type ToValue, Value } from "#value";

export class Identifier<TName extends string = string> implements Display, ToAST, ToValue {
	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public toString(): TName {
		return this.name;
	}

	/*@__NO_SIDE_EFFECTS__*/
	public to_ast(): IdentifierAST {
		const { name } = this;
		return {
			type: "Identifier",
			name,
		};
	}

	public to_value(): Value<[typeof this]> {
		return new Value(this);
	}
}
