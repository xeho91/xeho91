import type { Display } from "@xeho91/lib-type/trait/display";
import type { IdSelector } from "css-tree";

import type { ToAST } from "#ast";
import { SelectorBase } from "#selector/base";

export class SelectorId<TId extends string = string> extends SelectorBase<"id"> implements Display, ToAST {
	public readonly id: TId;

	constructor(id: TId) {
		super("id");
		this.id = id;
	}

	public toString(): Stringified<TId> {
		return `#${this.id}`;
	}

	public to_ast(): IdSelector {
		const { id } = this;
		return {
			type: "IdSelector",
			name: id,
		};
	}
}

type Stringified<Id extends string> = `#${Id}`;
