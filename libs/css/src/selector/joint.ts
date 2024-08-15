import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";
import { type CssNode, List, type Selector } from "css-tree";

import type { ToAST } from "#ast";
import type { SelectorBase } from "#selector/base";
import { SelectorComplex } from "#selector/complex";
import { SelectorsList } from "#selector/list";

// TODO: Could possibly restrict it more, e.g. there can't be more than one ID selector?

export class SelectorsJoint<const TSelectors extends SelectorBase[] = SelectorBase[]>
	extends IterableInstance<SelectorBase>
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
		return this.iterable.join("") as Stringified<TSelectors>;
	}

	/*@__NO_SIDE_EFFECTS__*/
	public to_ast(): Selector {
		const { selectors } = this;
		// biome-ignore lint/style/useConst: Readability - mutating
		let children = new List<CssNode>();
		for (const selector of selectors) children.push(selector.to_ast());
		return {
			type: "Selector",
			children,
		};
	}

	public to_complex(): SelectorComplex<[typeof this]> {
		return new SelectorComplex(this);
	}

	public to_list(): SelectorsList<[typeof this]> {
		return new SelectorsList(this);
	}

	public add<Selector extends SelectorBase>(selector: Selector): void {
		this.iterable.push(selector);
	}
}

type Stringified<Selectors extends SelectorBase[]> = Join<InferDisplays<Selectors>, "">;
