import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";

import { SelectorClass } from "#selector/class";
import { SelectorPseudoClass, type PseudoClassName } from "#selector/pseudo-class";
import { SelectorPseudoElement, type PseudoElementName } from "#selector/pseudo-element";

export type SelectorType = IterableElement<typeof Selector.TYPES>;

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative then, to have statics?
export class Selector implements Display {
	static readonly #TYPES = [
		"attribute",
		"class",
		"id",
		"pseudo-class",
		"pseudo-element",
		"type",
		"universal",
	] as const;
	public static readonly TYPES = readonly_set(Selector.#TYPES);

	public static [Symbol.iterator](): IterableIterator<SelectorType> {
		return Selector.#TYPES[Symbol.iterator]();
	}

	// public static attribute = <Attribute extends string, Value extends string>(attribute: Attribute, value: Value) =>
	// 	new CSSSelectorAttribute(attribute, value);
	public static class = <Name extends string>(name: Name) => new SelectorClass(name);
	// public static element = <Tag extends HTMLTag>(tag: Tag) => new CSSSelectorElement(tag);
	// public static id = <Id extends string>(id: Id) => new CSSSelectorId(id);
	public static readonly pseudo = {
		class: <Name extends PseudoClassName>(name: Name) => new SelectorPseudoClass(name),
		element: <Name extends PseudoElementName>(name: Name) => new SelectorPseudoElement(name),
	} as const;
	// public static readonly universal = new CSSSelectorUniversal();
	// public static joint = <const Selectors extends CSSSelectorBase[]>(selectors: Selectors) =>
	// 	new CSSSelectorsJoint(selectors);
}
