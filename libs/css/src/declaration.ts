import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import type { Declaration as DeclarationAST } from "css-tree";

import type { Property } from "#property";
import type { ToAST } from "#type";
import type { Value } from "#value";
import { Block } from "#block";

export class Declaration<TProperty extends Property = Property, TValue extends Value = Value>
	implements Display<Stringified<TProperty, TValue>>, ToAST<DeclarationAST>
{
	public readonly property: TProperty;
	public readonly value: TValue;

	constructor(property: TProperty, value: TValue) {
		this.property = property;
		this.value = value;
	}

	public toString(): Stringified<TProperty, TValue> {
		const { property, value } = this;
		return `${property}:${value}` as Stringified<TProperty, TValue>;
	}

	public to_ast(): DeclarationAST {
		const { property, value } = this;
		return {
			type: "Declaration",
			property: property.toString(),
			value: value.to_ast(),
			important: false,
		};
	}

	public to_block(): Block<[typeof this]> {
		return new Block(this);
	}
}

type Stringified<TProperty extends Property, TValue extends Value> = `${ToString<TProperty>}:${ToString<TValue>}`;
