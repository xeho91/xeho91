import { readonly_set } from "@xeho91/lib-snippet/set";
import type { Join } from "@xeho91/lib-type/array";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";
import { type Atrule, type CssNode, List } from "css-tree";

import type { ToAST } from "#ast";
import { AtRuleBase } from "#at-rule";
import type { Block } from "#block";
import { Identifier } from "#identifier";
import { Operator } from "#operator";

export type AtLayerName = IterableElement<typeof AtLayer.NAMES>;

export class AtLayer<TName extends AtLayerName = AtLayerName, TBlock extends Block = Block>
	extends AtRuleBase<"layer">
	implements Display, ToAST
{
	static readonly #NAME = "layer";

	public static readonly NAMES = readonly_set(["reset", "token", "framework", "base", "component", "override"]);

	public static readonly ORDER = new (class extends IterableInstance<AtLayerName> {
		protected iterable = AtLayer.NAMES;

		public toString(): StringifiedOrder<typeof AtLayer.NAMES> {
			const { iterable } = this;
			let results = "@layer ";
			let index = 0;
			for (const name of iterable) {
				results += name;
				if (!this.is_index_last(index)) results += ",";
				else results += ";";
				index++;
			}
			return results as StringifiedOrder<typeof AtLayer.NAMES>;
		}

		/*@__NO_SIDE_EFFECTS__*/
		public to_ast(): Atrule {
			const { iterable } = this;
			const children = new List<CssNode>();
			let index = 0;
			for (const name of iterable) {
				children.push(new Identifier(name).to_ast());
				if (!this.is_index_last(index)) children.push(Operator.COMMA.to_ast());
				index++;
			}
			return {
				type: "Atrule",
				name: "layer",
				prelude: {
					type: "AtrulePrelude",
					children,
				},
				block: null,
			};
		}

		public [Symbol.iterator](): IterableIterator<AtLayerName> {
			return AtLayer.NAMES[Symbol.iterator]();
		}
	})();

	public static [Symbol.iterator](): IterableIterator<AtLayerName> {
		return AtLayer.NAMES[Symbol.iterator]();
	}

	public readonly name: TName;
	public block: TBlock;

	constructor(data: { name: TName; block: TBlock }) {
		super(AtLayer.#NAME);
		const { name, block } = data;
		this.name = name;
		this.block = block;
	}

	public toString(): Stringified<TName, TBlock> {
		const { block, name, prefix } = this;
		return `${prefix} ${name} ${block}` as Stringified<TName, TBlock>;
	}

	/*@__NO_SIDE_EFFECTS__*/
	public to_ast(): Atrule {
		const { name, block } = this;
		const children = new List<CssNode>();
		children.push({
			type: "Identifier",
			name,
		});
		return {
			type: "Atrule",
			name: AtLayer.#NAME,
			prelude: {
				type: "AtrulePrelude",
				children,
			},
			block: block.to_ast(),
		};
	}
}

type Stringified<TName extends AtLayerName, TBlock extends Block> = `${AtLayer["prefix"]} ${TName} ${ToString<TBlock>}`;

type StringifiedOrder<TOrder extends ReadonlySet<AtLayerName>> =
	`${AtLayer["prefix"]} ${Join<IterableElement<TOrder>[], ",">};`;
