import type { Display } from "@xeho91/lib-type/trait/display";

import { SelectorBase } from "#selector/base";

type Value = string | number | boolean;
// TODO: Idea: could create map with aliases for these operators
export type AttributeOperator = "=" | "~=" | "|=" | "^=" | "$=" | "*=";
// TODO: Idea: could create map with aliases for these modifiers
export type AttributeModifier = "i" | "s";

export class SelectorAttribute<
		TName extends string = string,
		TOperator extends AttributeOperator = "=",
		TValue extends Value | undefined = undefined,
		TModifier extends AttributeModifier | undefined = undefined,
	>
	extends SelectorBase<"attribute">
	implements Display<Stringified<TName, TOperator, TValue, TModifier>>
{
	public name: string;
	public operator: TOperator;
	public value: TValue | undefined;
	public modifier: TModifier | undefined;

	constructor(name: TName, data: { operator?: TOperator; value?: TValue; modifier?: TModifier } = {}) {
		super("attribute");
		const { operator = "=", value, modifier } = data;
		this.name = name;
		this.operator = operator as TOperator;
		this.value = value;
		this.modifier = modifier;
	}

	public override toString(): Stringified<TName, TOperator, TValue, TModifier> {
		const { name, operator, value, modifier } = this;
		let content = `${name}`;
		if (value) {
			content += operator;
			content += `"${value}"`;
		}
		if (modifier) {
			content += " ";
			content += modifier;
		}
		return `[${content}]` as Stringified<TName, TOperator, TValue, TModifier>;
	}
}

type Stringified<
	TName extends string,
	TOperator extends AttributeOperator,
	TValue extends Value | undefined,
	TModifier extends AttributeModifier | undefined,
> = TValue extends Value
	? TModifier extends AttributeModifier
		? `[${TName}${TOperator}"${TValue}" ${TModifier}]`
		: `[${TName}${TOperator}"${TValue}"]`
	: TModifier extends AttributeModifier
		? `[${TName} ${TModifier}]`
		: `[${TName}]`;
