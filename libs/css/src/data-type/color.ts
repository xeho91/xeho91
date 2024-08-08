import { AtProperty } from "#at-rule/property";
import { DataType } from "#data-type/type";
import type { Var } from "#function/var";
import { Identifier } from "#identifier";
import { Reference } from "#reference";
import { Syntax } from "#syntax";
import type { ToAST } from "#type";
import type { ToValue } from "#value";

type AllowedValue = ToValue & ToAST;

export class Color<TValue extends AllowedValue = AllowedValue>
	extends DataType<"color", TValue>
	implements ToValue, ToAST
{
	public static readonly DEFAULT_VALUE = new Identifier("transparent") satisfies AllowedValue;

	public static default = () => new Color(Color.DEFAULT_VALUE);

	public static readonly SYNTAX = new Syntax("color");

	public static create_reference = <TTarget extends string>(target: TTarget): Reference<`${TTarget}-color`> =>
		new Reference(`${target}-color`);

	public static from_reference = <TReference extends Reference>(reference: TReference): Color<Var<TReference>> => {
		new AtProperty(reference, {
			syntax: new Syntax("color"),
			initial_value: Color.DEFAULT_VALUE.to_value(),
			inherits: true,
		});
		return new Color(reference.to_var());
	};

	constructor(value: TValue) {
		super("color", value);
	}
}
