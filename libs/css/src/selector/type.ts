import type { Display } from "@xeho91/lib-type/trait/display";
import type { TypeSelector } from "css-tree";

import { SelectorBase } from "#selector/base";
import type { ToAST } from "#type";

export type HTMLTag = keyof HTMLElementTagNameMap & (string & {});

export class SelectorType<TTag extends HTMLTag | string = HTMLTag | string>
	extends SelectorBase<"type">
	implements Display<TTag>, ToAST<TypeSelector>
{
	public readonly tag: TTag;

	constructor(tag: TTag) {
		super("type");
		this.tag = tag;
	}

	public toString() {
		return this.tag;
	}

	public to_ast(): TypeSelector {
		const { tag } = this;
		return {
			type: "TypeSelector",
			name: tag,
		};
	}
}
