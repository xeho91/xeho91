import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";

import type { SelectorBase } from "#selector/base";
import type { SelectorsJoint } from "#selector/joint";

type Item = SelectorBase | SelectorsJoint;

export class SelectorComplex<const TSelectors extends Item[] = Item[]>
	extends IterableInstance<Item>
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

	public toString() {
		return this.iterable.map((s) => s.toString()).join(" ") as Stringified<TSelectors>;
	}
}

type Stringified<TList extends Item[]> = Join<InferDisplays<TList>, " ">;
