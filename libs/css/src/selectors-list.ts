import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";

import type { SelectorBase } from "#selector/base";
import type { SelectorComplex } from "#selector/complex";
import type { SelectorsJoint } from "#selector/joint";

type Item = SelectorComplex | SelectorsJoint | SelectorBase;

export class SelectorsList<const TList extends Item[] = Item[]>
	extends IterableInstance<Item>
	implements Display<Stringified<TList>>
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

	public get first(): TList[0] {
		return this.iterable[0] as TList[0];
	}

	public get last() {
		return this.iterable[this.size - 1];
	}

	public toString() {
		return this.iterable.map((s) => s.toString()).join(",") as Stringified<TList>;
	}
}

type Stringified<TList extends Item[]> = Join<InferDisplays<TList>, ",">;
