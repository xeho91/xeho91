import { readonly_set } from "@xeho91/lib-snippet/set";
import type { Join } from "@xeho91/lib-type/array";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";
import { type Atrule, type CssNode, List } from "css-tree";

import { AtRuleBase } from "#at-rule";
import type { Block } from "#block";
import { Identifier } from "#identifier";
import { Operator } from "#operator";
import type { ToAST } from "#type";

export type AtLayerName = IterableElement<typeof AtLayer.NAMES>;

export class AtLayer<TName extends AtLayerName = AtLayerName, TBlock extends Block = Block>
	extends AtRuleBase<"layer">
	implements Display<Stringified<TName, TBlock>>, ToAST<Atrule> {
	static readonly #NAME = "layer";

	public static readonly NAMES = readonly_set(["reset", "token", "framework", "base", "component", "override"]);

	public static readonly ORDER = new (class extends IterableInstance<AtLayerName> {
		protected iterable = AtLayer.NAMES;

		get #array(): AtLayerName[] {
			return [...AtLayer.NAMES];
		}

		public toString(): StringifiedOrder<typeof AtLayer.NAMES> {
			// TODO: Optimize it
			return `@layer ${this.#array.join(",")};` as StringifiedOrder<typeof AtLayer.NAMES>;
		}

		public to_ast(): Atrule {
			const children = new List<CssNode>();
			this.#array.forEach((name, index) => {
				children.push(new Identifier(name).to_ast());
				const next = this.#array[index + 1];
				if (next) children.push(Operator.COMMA.to_ast());
			});
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
		return `${prefix} ${name} ${block.toString()}` as Stringified<TName, TBlock>;
	}

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
