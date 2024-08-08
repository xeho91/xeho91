import { readonly_set } from "@xeho91/lib-snippet/set";
import type { Display } from "@xeho91/lib-type/trait/display";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export type AtRuleType = IterableElement<typeof AtRule.TYPES>;

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative?
export class AtRule {
	public static readonly PREFIX = "@";

	static readonly TYPES = readonly_set([
		//
		"layer",
		"property",
	]);

	public static [Symbol.iterator](): IterableIterator<AtRuleType> {
		return AtRule.TYPES[Symbol.iterator]();
	}
}

export abstract class AtRuleBase<TType extends AtRuleType = AtRuleType> implements Display {
	public readonly type: TType;

	constructor(type: TType) {
		this.type = type;
	}

	public get prefix(): Prefix<TType> {
		return `${AtRule.PREFIX}${this.type}`;
	}

	public abstract toString(): string;
}

type Prefix<TType extends AtRuleType> = `${typeof AtRule.PREFIX}${TType}`;
