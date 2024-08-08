import type { Display } from "@xeho91/lib-type/trait/display";
import type { Identifier as IdentifierAST } from "css-tree";

import type { ToAST } from "#type";
import { Value, type ToValue } from "#value";

export class Identifier<TName extends string = string> implements Display<TName>, ToAST<IdentifierAST>, ToValue {
	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public toString(): TName {
		return this.name;
	}

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
