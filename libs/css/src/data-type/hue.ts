import { AtProperty } from "#at-rule/property";
import { DataType } from "#data-type/type";
import type { Var } from "#function/var";
import { Reference } from "#reference";
import { Dimension } from "#value/dimension";

type AllowedValue = Dimension | Var;

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch#h}
 */
export class Hue<TValue extends AllowedValue = AllowedValue> extends DataType<typeof Hue.NAME, TValue> {
	public static readonly NAME = "hue";
	public static readonly DEFAULT_VALUE = new Dimension(0, "deg") satisfies AllowedValue;

	public static default = () => new Hue(Hue.DEFAULT_VALUE);

	public static create_reference<TPrefix extends string>(
		prefix: TPrefix,
	): Reference<`${TPrefix}-${typeof Hue.NAME}`> {
		const reference = new Reference(`${prefix}-${Hue.NAME}`);
		Hue.create_at_property(reference);
		return reference;
	}

	public static from_reference<TReference extends Reference>(
		reference: TReference,
	): Hue<Var<Reference<`${TReference["name"]}-${typeof Hue.NAME}`>>> {
		const { name } = reference;
		return new Hue(Hue.create_reference(name).to_var());
	}

	public static create_at_property = <TReference extends Reference>(reference: TReference) => {
		return new AtProperty(reference, {
			syntax: Hue.DEFAULT_VALUE.unit.syntax,
			initial_value: Hue.DEFAULT_VALUE.to_value(),
			inherits: true,
		});
	};

	public static degree = <TValue extends number>(value: TValue) => new Hue(new Dimension(value, "deg"));

	constructor(value: TValue) {
		super(Hue.NAME, value);
	}
}
