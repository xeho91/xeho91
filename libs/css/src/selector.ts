import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";

import { SelectorAttribute } from "#selector/attribute";
import type { SelectorBase } from "#selector/base";
import { SelectorClass } from "#selector/class";
import { SelectorId } from "#selector/id";
import { SelectorsJoint } from "#selector/joint";
import { type PseudoClassName, SelectorPseudoClass } from "#selector/pseudo-class";
import { type PseudoElementName, SelectorPseudoElement } from "#selector/pseudo-element";
import { type HTMLTag, SelectorType } from "#selector/type";
import { SelectorUniversal } from "#selector/universal";

export type SelectorKind = IterableElement<typeof Selector.KINDS>;

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative then, to have statics?
export class Selector implements Display {
	public static readonly KINDS = readonly_set([
		"attribute",
		"class",
		"id",
		"pseudo-class",
		"pseudo-element",
		"type",
		"universal",
	]);

	public static [Symbol.iterator](): IterableIterator<SelectorKind> {
		return Selector.KINDS[Symbol.iterator]();
	}

	public static attribute = <
		TAttribute extends string,
		const TData extends ConstructorParameters<typeof SelectorAttribute>[1],
	>(
		attribute: TAttribute,
		data: TData,
	) => new SelectorAttribute(attribute, data);
	public static class = <TName extends string>(name: TName) => new SelectorClass(name);

	public static type = <TTag extends HTMLTag>(tag: TTag) => new SelectorType(tag);

	public static id = <TId extends string>(id: TId) => new SelectorId(id);

	public static readonly pseudo = {
		class: <TName extends PseudoClassName>(name: TName) => new SelectorPseudoClass(name),
		element: <TName extends PseudoElementName>(name: TName) => new SelectorPseudoElement(name),
	} as const;

	public static readonly universal = new SelectorUniversal();

	public static joint = <const TSelectors extends SelectorBase[]>(selectors: TSelectors) =>
		new SelectorsJoint(...selectors);
}
