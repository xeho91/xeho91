import type { Display } from "@xeho91/lib-type/trait/display";
import type { ClassSelector } from "css-tree";

import type { ToAST } from "#ast";
import { SelectorBase } from "#selector/base";

export class SelectorClass<TName extends string = string> extends SelectorBase<"class"> implements Display, ToAST {
	public name: TName;

	constructor(name: TName) {
		super("class");
		this.name = name;
	}

	public toString(): Stringified<TName> {
		return `.${this.name}`;
	}

	public to_ast(): ClassSelector {
		const { name } = this;
		return {
			type: "ClassSelector",
			name,
		};
	}

	public add_prefix<Prefix extends string>(prefix: Prefix): void {
		this.name = `${prefix}-${this.name}` as TName;
	}

	public add_suffix<Suffix extends string>(suffix: Suffix): void {
		this.name = `${this.name}-${suffix}` as TName;
	}
}

type Stringified<Name extends string> = `.${Name}`;
