import { AtProperty } from "#at-rule/property";
import { DataType } from "#data-type/type";
import type { Var } from "#function/var";
import { Reference } from "#reference";
import type { NumberCSS } from "#value/number";
import { Percentage } from "#value/percentage";

type AllowedValue = NumberCSS | Percentage | Var;

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch#c}
 */
export class Chroma<TValue extends AllowedValue = AllowedValue> extends DataType<typeof Chroma.NAME, TValue> {
	public static readonly NAME = "chroma";
	public static readonly DEFAULT_VALUE = new Percentage(0) satisfies AllowedValue;

	public static default = () => new Chroma(Chroma.DEFAULT_VALUE);

	public static create_reference<TPrefix extends string>(
		prefix: TPrefix,
	): Reference<`${TPrefix}-${typeof Chroma.NAME}`> {
		const reference = new Reference(`${prefix}-${Chroma.NAME}`);
		Chroma.create_at_property(reference);
		return reference;
	}

	public static from_reference<TReference extends Reference>(
		reference: TReference,
	): Chroma<Var<Reference<`${TReference["name"]}-${typeof Chroma.NAME}`>>> {
		const { name } = reference;
		return new Chroma(Chroma.create_reference(name).to_var());
	}

	public static create_at_property = <TReference extends Reference>(reference: TReference) => {
		return new AtProperty(reference, {
			syntax: Chroma.DEFAULT_VALUE.syntax,
			initial_value: Chroma.DEFAULT_VALUE.to_value(),
			inherits: true,
		});
	};

	public static percentage = <TValue extends number>(value: TValue) => new Chroma(new Percentage(value));

	constructor(value: TValue) {
		super(Chroma.NAME, value);
	}
}
