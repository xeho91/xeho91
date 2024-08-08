import { DataType } from "#data-type/type";
import type { Var } from "#function/var";
import { Reference } from "#reference";
import type { NumberCSS } from "#value/number";
import { Percentage } from "#value/percentage";
import { AtProperty } from "#at-rule/property";
import { Syntax } from "#syntax";

type AllowedValue = NumberCSS | Percentage | Var;

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch#a}
 */
export class Alpha<TValue extends AllowedValue = AllowedValue> extends DataType<typeof Alpha.NAME, TValue> {
	public static readonly NAME = "alpha";
	public static readonly DEFAULT_VALUE = new Percentage(100) satisfies AllowedValue;

	public static default = () => new Alpha(Alpha.DEFAULT_VALUE);

	public static create_reference<TPrefix extends string>(
		prefix: TPrefix,
	): Reference<`${TPrefix}-${typeof Alpha.NAME}`> {
		return new Reference(`${prefix}-${Alpha.NAME}`);
	}

	public static from_reference<TReference extends Reference>(
		reference: TReference,
	): Alpha<Var<Reference<`${TReference["name"]}-${typeof Alpha.NAME}`>>> {
		const { name } = reference;
		const new_reference = Alpha.create_reference(name);
		new AtProperty(new_reference, {
			syntax: new Syntax("percentage"),
			initial_value: Alpha.DEFAULT_VALUE.to_value(),
			inherits: true,
		});
		return new Alpha(new_reference.to_var());
	}

	public static percentage = <TValue extends number>(value: TValue) => new Alpha(new Percentage(value));

	constructor(value = Alpha.DEFAULT_VALUE as TValue) {
		super(Alpha.NAME, value);
	}
}
