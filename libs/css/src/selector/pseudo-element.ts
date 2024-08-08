import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";
import type { PseudoElementSelector } from "css-tree";

import { SelectorBase } from "#selector/base";
import type { ToAST } from "#type";

export type PseudoElementName = IterableElement<typeof SelectorPseudoElement.NAMES>;

export class SelectorPseudoElement<TName extends PseudoElementName>
	extends SelectorBase<"pseudo-element">
	implements Display<Stringified<TName>>, ToAST<PseudoElementSelector>
{
	static readonly #NAMES = [
		"after",
		"backdrop",
		"before",
		"first-letter",
		"first-line",
		"file-selector-button",
		"marker",
		"placeholder",
		"selection",
	] as const;
	public static readonly NAMES = readonly_set(SelectorPseudoElement.#NAMES);

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
