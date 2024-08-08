import type { ToAST } from "#ast";
import { AtProperty } from "#at-rule/property";
import { DataType } from "#data-type/type";
import type { Var } from "#function/var";
import { Reference } from "#reference";
import { ShadowTarget, type ShadowTargetName } from "#target/shadow";
import type { ToValue } from "#value";
import { Dimension } from "#value/dimension";

type SpreadValue = ToValue & ToAST;

type SpreadTargetName = ShadowTargetName;

export class Spread<TValue extends SpreadValue = SpreadValue> extends DataType<typeof Spread.NAME, TValue> {
	public static readonly NAME = "spread";
	public static readonly DEFAULT_VALUE = new Dimension(0, "px") satisfies SpreadValue;

	public static default = () => new Spread(Spread.DEFAULT_VALUE);

	public static create_reference = <TTarget extends string>(
		target: TTarget,
	): Reference<`${TTarget}-${typeof Spread.NAME}`> => new Reference(`${target}-${Spread.NAME}`);

	public static from_reference = <TReference extends Reference>(reference: TReference): Spread<Var<TReference>> => {
		new AtProperty(reference, {
			syntax: Spread.DEFAULT_VALUE.unit.syntax,
			initial_value: Spread.DEFAULT_VALUE.to_value(),
			inherits: true,
		});
		return new Spread(reference.to_var());
	};

	constructor(value: TValue) {
		super(Spread.NAME, value);
	}

	public create_reference<TTargetName extends SpreadTargetName>(
		target_name: TTargetName,
	): Reference<`${TTargetName}-${typeof this.name}`> {
		const { name } = this;
		return new ShadowTarget(target_name).create_reference(name);
	}
}
