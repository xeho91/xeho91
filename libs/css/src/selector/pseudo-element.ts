import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";
import type { PseudoElementSelector } from "css-tree";

import type { ToAST } from "#ast";
import { SelectorBase } from "#selector/base";

export type PseudoElementName = IterableElement<typeof SelectorPseudoElement.NAMES>;

export class SelectorPseudoElement<TName extends PseudoElementName>
	extends SelectorBase<"pseudo-element">
	implements Display, ToAST
{
	public static readonly NAMES = readonly_set([
		"after",
		"backdrop",
		"before",
		"first-letter",
		"first-line",
		"file-selector-button",
		"marker",
		"placeholder",
		"selection",
	]);

	public static [Symbol.iterator](): IterableIterator<PseudoElementName> {
		return SelectorPseudoElement.NAMES[Symbol.iterator]();
	}

	public readonly name: TName;

	constructor(name: TName) {
		super("pseudo-element");
		this.name = name;
	}

	public toString(): Stringified<TName> {
		return `::${this.name}`;
	}

	/*@__NO_SIDE_EFFECTS__*/
	public to_ast(): PseudoElementSelector {
		const { name } = this;
		return {
			type: "PseudoElementSelector",
			name,
			children: null,
		};
	}
}

type Stringified<TName extends PseudoElementName = PseudoElementName> = `::${TName}`;
