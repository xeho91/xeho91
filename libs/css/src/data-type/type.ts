import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import type { CssNode } from "css-tree";

import type { ToAST } from "#ast";
import type { InferValue, ToValue } from "#value";

type AllowedValue = Display & ToValue & ToAST;

export abstract class DataType<TName extends string, TValue extends AllowedValue> implements Display, ToValue, ToAST {
	public readonly name: TName;
	public value: TValue;

	constructor(name: TName, value: TValue) {
		this.name = name;
		this.value = value;
	}

	public toString(): ToString<TValue> {
		return this.value.toString() as ToString<TValue>;
	}

	public to_value(): InferValue<TValue> {
		const { value } = this;
		return value.to_value() as InferValue<TValue>;
	}

	public to_ast(): CssNode {
		return this.value.to_ast();
	}
}
