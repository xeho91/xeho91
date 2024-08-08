import { AtProperty } from "#at-rule/property";
import { DataType } from "#data-type/type";
import type { Var } from "#function/var";
import { Reference } from "#reference";
import type { NumberCSS } from "#value/number";
import { Percentage } from "#value/percentage";

type AllowedValue = NumberCSS | Percentage | Var;

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch#l}
 */
export class Lightness<TValue extends AllowedValue = AllowedValue> extends DataType<typeof Lightness.NAME, TValue> {
	public static NAME = "lightness";
	public static readonly DEFAULT_VALUE = new Percentage(0) satisfies AllowedValue;

	public static default = () => new Lightness(Lightness.DEFAULT_VALUE);

	public static create_reference = <TPrefix extends string>(
		prefix: TPrefix,
	): Reference<`${TPrefix}-${typeof Lightness.NAME}`> => {
		const reference = new Reference(`${prefix}-${Lightness.NAME}`);
		Lightness.create_at_property(reference);
		return reference;
	};

	public static from_reference = <TReference extends Reference>(
		reference: TReference,
	): Lightness<Var<Reference<`${TReference["name"]}-${typeof Lightness.NAME}`>>> => {
		const { name } = reference;
		return new Lightness(Lightness.create_reference(name).to_var());
	};

	public static create_at_property = <TReference extends Reference>(reference: TReference) => {
		return new AtProperty(reference, {
			syntax: Lightness.DEFAULT_VALUE.syntax,
			initial_value: Lightness.DEFAULT_VALUE.to_value(),
			inherits: true,
		});
	};

	public static percentage = <TValue extends number>(value: TValue) => new Lightness(new Percentage(value));

	constructor(value: TValue) {
		super(Lightness.NAME, value);
	}
}
