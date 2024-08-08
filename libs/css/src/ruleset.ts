import type { Display, ToString } from "@xeho91/lib-type/trait/display";

import type { Block } from "#block";
import type { SelectorsList } from "#selectors-list";
import { RulesetsList } from "#rulesets-list";

export class Ruleset<const TSelectors extends SelectorsList = SelectorsList, const TBlock extends Block = Block>
	implements Display<Stringified<TSelectors, TBlock>>
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

	public to_list(): RulesetsList<[typeof this]> {
		return new RulesetsList(this);
	}
}

type Stringified<
	Selectors extends SelectorsList,
	Declarations extends Block,
> = `${ToString<Selectors>}${ToString<Declarations>}`;
