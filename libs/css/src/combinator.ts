import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";
import type { Combinator as CombinatorAST } from "css-tree";

import type { ToAST } from "#ast";

export type CombinatorName = IterableElement<typeof Combinator.NAMES>;

export class Combinator<TName extends string = string> implements Display, ToAST {
	public static readonly NAMES = readonly_set([" ", ">"]);

	public static [Symbol.iterator](): IterableIterator<CombinatorName> {
		return Combinator.NAMES[Symbol.iterator]();
	}

	public static CHILD = new Combinator(">");
	public static SPACE = new Combinator(" ");

	public readonly name: TName;

	private constructor(name: TName) {
		this.name = name;
	}

	public toString(): TName {
		return this.name;
	}

	public to_ast(): CombinatorAST {
		const { name } = this;
		return {
			type: "Combinator",
			name,
		};
	}
}
