import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";
import { type CssNode, List, type SelectorList } from "css-tree";

import type { ToAST } from "#ast";
import { SelectorBase } from "#selector/base";
import type { SelectorComplex } from "#selector/complex";
import type { SelectorsJoint } from "#selector/joint";

type Item = SelectorComplex | SelectorsJoint | SelectorBase;

export class SelectorsList<const TList extends Item[] = Item[]>
	extends IterableInstance<TList[number]>
	implements Display, ToAST
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

	public to_ast(): SelectorList {
		const { list } = this;
		// biome-ignore lint/style/useConst: Readability - mutation
		let children = new List<CssNode>();
		for (const selector of list) {
			if (selector instanceof SelectorBase) {
				// biome-ignore lint/style/useConst: Readability - mutation
				let selector_children = new List<CssNode>();
				selector_children.push(selector.to_ast());
				children.push({
					type: "Selector",
					children: selector_children,
				});
			} else children.push(selector.to_ast());
		}
		return {
			type: "SelectorList",
			children,
		};
	}
}

type Stringified<TList extends Item[]> = Join<InferDisplays<TList>, ",">;
