import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";

import type { Ruleset } from "#ruleset";

export class RulesetsList<const TList extends Ruleset[] = Ruleset[]>
	extends IterableInstance<Ruleset>
	implements Display
{
	protected iterable: TList;

	constructor(...list: TList) {
		super();
		this.iterable = list;
	}

	public get list(): TList {
		return this.iterable;
	}

	public set list(list: TList) {
		this.iterable = list;
	}

	public toString(): Stringified<TList> {
		const { list } = this;
		let results = "";
		for (const ruleset of list) results += ruleset.toString();
		return results as Stringified<TList>;
	}
}

type Stringified<List extends Ruleset[]> = Join<InferDisplays<List>, "">;
