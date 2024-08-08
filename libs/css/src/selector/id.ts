import type { Display } from "@xeho91/lib-type/trait/display";
import type { IdSelector } from "css-tree";

import { SelectorBase } from "#selector/base";
import type { ToAST } from "#type";

export class SelectorId<TId extends string = string>
	extends SelectorBase<"id">
	implements Display<Stringified<TId>>, ToAST<IdSelector>
{
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

	public add_prefix<Prefix extends string>(prefix: Prefix) {
		return new SelectorId(`${prefix}-${this.id}`);
	}

	public add_suffix<Suffix extends string>(suffix: Suffix) {
		return new SelectorId(`${this.id}-${suffix}`);
	}
}

type Stringified<Id extends string> = `#${Id}`;
