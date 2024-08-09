import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";
import { type CssNode, List, type Selector } from "css-tree";

import type { ToAST } from "#ast";
import { Combinator } from "#combinator";
import type { SelectorBase } from "#selector/base";
import type { SelectorsJoint } from "#selector/joint";

type Item = SelectorBase | SelectorsJoint;

export class SelectorComplex<const TSelectors extends Item[] = Item[]>
	extends IterableInstance<TSelectors[number]>
	implements Display, ToAST
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

	public to_ast(): Selector {
		const { selectors } = this;
		// biome-ignore lint/style/useConst: Readability - mutating
		let children = new List<CssNode>();
		for (const [index, selector] of selectors.entries()) {
			children.push(selector.to_ast());
			if (!this.is_index_last(index)) children.push(Combinator.SPACE.to_ast());
		}
		return {
			type: "Selector",
			children,
		};
	}
}

type Stringified<TList extends Item[]> = Join<InferDisplays<TList>, " ">;
