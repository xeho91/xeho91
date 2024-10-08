import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";
import type { PseudoClassSelector } from "css-tree";

import { SelectorBase } from "#selector/base";

export type PseudoClassName = IterableElement<typeof SelectorPseudoClass.NAMES>;

// TODO: Add optional value for e.g. `where`
export class SelectorPseudoClass<TName extends PseudoClassName>
	extends SelectorBase<"pseudo-class">
	implements Display
{
	public static readonly NAMES = readonly_set([
		"root",
		"active",
		"any-link",
		"autofill",
		"checked",
		"default",
		"disabled",
		"empty",
		"enabled",
		"first",
		"first-child",
		"first-of-type",
		"focus",
		"focus-visible",
		"focus-within",
		"fullscreen",
		"has",
		"host",
		"host",
		"hover",
		"indeterminate",
		"in-range",
		"invalid",
		"is",
		"lang",
		"last-child",
		"last-of-type",
		"link",
		"modal",
		"not",
		"nth-child",
		"nth-last-child",
		"nth-last-of-type",
		"nth-of-type",
		"only-child",
		"only-of-type",
		"optional",
		"out-of-range",
		"paused",
		"picture-in-picture",
		"placeholder-shown",
		"playing",
		"read-only",
		"read-write",
		"required",
		"root",
		"scope",
		"target",
		"user-invalid",
		"valid",
		"visited",
		"where",
	]);

	public static [Symbol.iterator](): IterableIterator<PseudoClassName> {
		return SelectorPseudoClass.NAMES[Symbol.iterator]();
	}

	public readonly name: TName;

	constructor(name: TName) {
		super("pseudo-class");
		this.name = name;
	}

	public toString(): Stringified<TName> {
		return `:${this.name}`;
	}

	/*@__NO_SIDE_EFFECTS__*/
	public to_ast(): PseudoClassSelector {
		const { name } = this;
		return {
			name,
			type: "PseudoClassSelector",
			// TODO: Add optional value for e.g. `where`
			children: null,
		};
	}
}

export type Stringified<Name extends PseudoClassName = PseudoClassName> = `:${Name}`;
