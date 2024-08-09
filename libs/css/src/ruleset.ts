import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import type { Rule } from "css-tree";

import type { ToAST } from "#ast";
import type { Block } from "#block";
import type { SelectorsList } from "#selector/list";

export class Ruleset<const TSelectors extends SelectorsList = SelectorsList, const TBlock extends Block = Block>
	implements Display, ToAST
{
	public selectors: TSelectors;
	public block: TBlock;

	constructor(selectors: TSelectors, block: TBlock) {
		this.selectors = selectors;
		this.block = block;
	}

	public toString(): Stringified<TSelectors, TBlock> {
		return `${this.selectors}${this.block}` as Stringified<TSelectors, TBlock>;
	}

	public to_ast(): Rule {
		const { block, selectors } = this;
		return {
			prelude: selectors.to_ast(),
			type: "Rule",
			block: block.to_ast(),
		};
	}
}

type Stringified<
	Selectors extends SelectorsList,
	Declarations extends Block,
> = `${ToString<Selectors>}${ToString<Declarations>}`;
