import type { Display } from "@xeho91/lib-type/trait/display";
import type { TypeSelector } from "css-tree";

import type { ToAST } from "#ast";
import { SelectorBase } from "#selector/base";

export type HTMLTag = keyof HTMLElementTagNameMap & (string & {});

export class SelectorType<TName extends HTMLTag | string = HTMLTag | string>
	extends SelectorBase<"type">
	implements Display, ToAST
{
	public static UNIVERSAL = new SelectorType("*");

	public readonly name: TName;

	constructor(tag: TName) {
		super("type");
		this.name = tag;
	}

	public toString() {
		return this.name;
	}

	public to_ast(): TypeSelector {
		const { name } = this;
		return {
			type: "TypeSelector",
			name: name,
		};
	}
}
