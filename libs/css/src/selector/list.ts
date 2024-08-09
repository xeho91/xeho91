import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";

import type { SelectorBase } from "#selector/base";
import type { SelectorComplex } from "#selector/complex";
import type { SelectorsJoint } from "#selector/joint";

type Item = SelectorComplex | SelectorsJoint | SelectorBase;

export class SelectorsList<const TList extends Item[] = Item[]>
	extends IterableInstance<TList[number]>
	implements Display
{
	protected iterable: TList;

	constructor(...selectors: TList) {
		super();
		this.iterable = selectors;
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
		for (const [index, selector] of list.entries()) {
			results += selector.toString();
			if (!this.is_index_last(index)) results += ",";
		}
		return results as Stringified<TList>;
	}
}

type Stringified<TList extends Item[]> = Join<InferDisplays<TList>, ",">;
