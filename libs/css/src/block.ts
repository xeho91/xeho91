import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";
import { type Block as BlockAST, type CssNode, List } from "css-tree";

import type { ToAST } from "#ast";

type Item = Display & ToAST;

export class Block<const TChildren extends Item[] = Item[]> extends IterableInstance<Item> implements Display, ToAST {
	protected iterable: TChildren;

	constructor(...children: TChildren) {
		super();
		this.iterable = children;
	}

	public get children(): TChildren {
		return this.iterable;
	}

	public set children(children: TChildren) {
		this.iterable = children;
	}

	public toString(): Stringified<TChildren> {
		const { children } = this;
		let results = "";
		for (const child of children) results += child.toString();
		return `{${results}}` as Stringified<TChildren>;
	}

	/*@__NO_SIDE_EFFECTS__*/
	public to_ast(): BlockAST {
		const { iterable } = this;
		// biome-ignore lint/style/useConst: Is being mutated
		let children = new List<CssNode>();
		for (const child of iterable) children.push(child.to_ast());
		return {
			type: "Block",
			children,
		};
	}
}

type Stringified<TChildren extends Item[]> = `{${Join<InferDisplays<TChildren>, ";">}}`;
