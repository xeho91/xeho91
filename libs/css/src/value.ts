import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";
import { List, type Value as ValueAST } from "css-tree";

import type { ToAST } from "#ast";

export type Item = ToAST;

export class Value<const TList extends Item[] = Item[]>
	extends IterableInstance<Item>
	implements Display<Stringified<TList>>, ToAST
{
	protected iterable: TList;

	constructor(...list: TList) {
		super();
		this.iterable = list;
	}

	public get list(): TList {
		return this.iterable;
	}

	public set list(list: TList) {
		this.iterable = list;
	}

	public toString(): Stringified<TList> {
		const { list } = this;
		let results = "";
		let index = 0;
		for (const value of list) {
			results += value.toString();
			const next = list[index + 1];
			if (next) results += " ";
			index++;
		}
		return results as Stringified<TList>;
	}

	public to_ast(): ValueAST {
		const { list } = this;
		const children = new List<ReturnType<Item["to_ast"]>>();
		for (const value of list) children.push(value.to_ast());
		return {
			type: "Value",
			children,
		};
	}
}

type Stringified<TList extends Item[]> = Join<InferDisplays<TList>, " ">;

export interface ToValue {
	to_value(): Value;
}

export type InferValue<T extends ToValue> = ReturnType<T["to_value"]>;
