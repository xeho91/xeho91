import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";
import type { Operator as OperatorAST } from "css-tree";

import type { ToAST } from "#ast";

type OperatorKind = IterableElement<typeof Operator.OPERATORS>;

export class Operator<TKind extends OperatorKind = OperatorKind> implements Display, ToAST {
	public static readonly OPERATORS = readonly_set([
		//
		"/",
		"*",
		",",
		":",
		"+",
		"-",
	]);

	public static [Symbol.iterator](): IterableIterator<OperatorKind> {
		return Operator.OPERATORS[Symbol.iterator]();
	}

	public static COLON = new Operator(":");
	public static COMMA = new Operator(",");
	public static FORWARD_SLASH = new Operator("/");

	public readonly value: TKind;

	constructor(value: TKind) {
		this.value = value;
	}

	public toString(): Stringified<TKind> {
		return this.value;
	}

	public to_ast(): OperatorAST {
		const { value } = this;
		return {
			type: "Operator",
			value,
		};
	}
}

type Stringified<TOperator extends OperatorKind> = TOperator;
