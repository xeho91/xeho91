import { readonly_set } from "@xeho91/lib-snippet/set";
import type { Join } from "@xeho91/lib-type/array";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display, InferDisplays, ToString } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";
import { type CssNode, type FunctionNode, List } from "css-tree";

import type { ToAST } from "#type";
import { type ToValue, Value } from "#value";

export type FunctionNameType = IterableElement<typeof FunctionName.NAMES>;

export class FunctionName<TName extends FunctionNameType = FunctionNameType> implements Display<TName> {
	static readonly #NAMES = [
		//
		"clamp",
		"light-dark",
		"oklch",
		"var",
	] as const;
	public static readonly NAMES = readonly_set(FunctionName.#NAMES);

	public static [Symbol.iterator](): IterableIterator<FunctionNameType> {
		return FunctionName.#NAMES[Symbol.iterator]();
	}

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public toString(): TName {
		return this.name;
	}
}

export abstract class FunctionBase<
	TName extends FunctionNameType = FunctionNameType,
	TChildren extends FunctionChildren = FunctionChildren,
> implements Display<Stringified<TName, TChildren>>, ToAST<FunctionNode>, ToValue
{
	public readonly name: FunctionName<TName>;

	constructor(name: TName) {
		this.name = new FunctionName(name);
	}

	public abstract get children(): TChildren;

	public toString(): Stringified<TName, TChildren> {
		const { name, children } = this;
		return `${name.toString()}${children.toString()}` as Stringified<TName, TChildren>;
	}

	public to_value(): Value<[typeof this]> {
		return new Value(this);
	}

	public to_ast(): FunctionNode {
		const { name, children } = this;
		return {
			type: "Function",
			name: name.toString(),
			children: children.to_ast(),
		};
	}
}

type Stringified<
	TName extends FunctionNameType,
	TChildren extends FunctionChildren,
> = `${ToString<FunctionName<TName>>}${ToString<TChildren>}`;

type FunctionChildrenItem = ToAST;

export class FunctionChildren<const TList extends FunctionChildrenItem[] = FunctionChildrenItem[]>
	extends IterableInstance<FunctionChildrenItem>
	implements Display<StringifiedChildren<TList>>
{
	protected iterable: TList;

	constructor(...nodes: TList) {
		super();
		this.iterable = nodes;
	}

	public get first(): TList[0] {
		return this.iterable[0] as TList[0];
	}

	public get last(): FunctionChildrenItem | undefined {
		return this.iterable[this.size - 1];
	}

	public toString(): StringifiedChildren<TList> {
		const { iterable } = this;
		let results = "";
		let index = 0;
		for (const instance of iterable) {
			results += instance.toString();
			if (index !== iterable.length - 1) results += " ";
			index++;
		}
		return `(${results})` as StringifiedChildren<TList>;
	}

	public to_ast(): List<CssNode> {
		const { iterable } = this;
		// biome-ignore lint/style/useConst: NOTE: I'm mutating it
		let children = new List<CssNode>();
		for (const node of iterable) children.push(node.to_ast());
		return children;
	}
}

type StringifiedChildren<TList extends FunctionChildrenItem[]> = `(${Join<InferDisplays<TList>, " ">})`;
