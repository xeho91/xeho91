import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";

import type { SelectorBase } from "#selector/base";
import type { SelectorsJoint } from "#selector/joint";

type Item = SelectorBase | SelectorsJoint;

export class SelectorComplex<const TSelectors extends Item[] = Item[]>
	extends IterableInstance<TSelectors[number]>
	implements Display
{
	protected iterable: TSelectors;

	constructor(...selectors: TSelectors) {
		super();
		this.iterable = selectors;
	}

	public get selectors(): TSelectors {
		return this.iterable;
	}

	public set selectors(selectors: TSelectors) {
		this.iterable = selectors;
	}

	public toString(): Stringified<TSelectors> {
		const { selectors } = this;
		let results = "";
		for (const [index, selector] of selectors.entries()) {
			results += selector.toString();
			if (!this.is_index_last(index)) results += " ";
		}
		return results as Stringified<TSelectors>;
	}
}

type Stringified<TList extends Item[]> = Join<InferDisplays<TList>, " ">;
