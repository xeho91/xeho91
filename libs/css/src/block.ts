import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";
import { List, type Block as BlockAST, type CssNode } from "css-tree";
import type { Join } from "@xeho91/lib-type/array";

import type { ToAST } from "#type";

type Item = Display & ToAST;

export class Block<const TChildren extends Item[] = Item[]>
	extends IterableInstance<Item>
	implements Display<Stringified<TChildren>>, ToAST<BlockAST> {
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
		let index = 0;
		for (const child of children) {
			results += child.toString();
			if (index < children.length - 1) results += ";";
			index++;
		}
		return `{${results}}` as Stringified<TChildren>;
	}

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

	public clear(): void {
		this.iterable = [] as unknown as TChildren;
	}
}

type Stringified<TChildren extends Item[]> = `{${Join<InferDisplays<TChildren>, ";">}}`;
