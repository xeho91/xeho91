import { AtProperty } from "#at-rule/property";
import { DataType } from "#data-type/type";
import type { Var } from "#function/var";
import { Reference } from "#reference";
import { ShadowTarget, type ShadowTargetName } from "#target/shadow";
import type { ToAST } from "#type";
import type { ToValue } from "#value";
import { Dimension } from "#value/dimension";

type BlurValue = ToValue & ToAST;

type BlurTargetName = ShadowTargetName;

export class Blur<TValue extends BlurValue = BlurValue> extends DataType<typeof Blur.NAME, TValue> {
	public static readonly NAME = "blur";
	public static readonly DEFAULT_VALUE = new Dimension(0, "px") satisfies BlurValue;

	public static default = () => new Blur(Blur.DEFAULT_VALUE);

	public static create_reference = <TTarget extends string>(
		target: TTarget,
	): Reference<`${TTarget}-${typeof Blur.NAME}`> => new Reference(`${target}-${Blur.NAME}`);

	public static from_reference = <TReference extends Reference>(reference: TReference): Blur<Var<TReference>> => {
		new AtProperty(reference, {
			syntax: Blur.DEFAULT_VALUE.unit.syntax,
			initial_value: Blur.DEFAULT_VALUE.to_value(),
			inherits: true,
		});
		return new Blur(reference.to_var());
	};

	constructor(value: TValue) {
		super(Blur.NAME, value);
	}

	public create_reference<TTargetName extends BlurTargetName>(
		target_name: TTargetName,
	): Reference<`${TTargetName}-${typeof this.name}`> {
		const { name } = this;
		return new ShadowTarget(target_name).create_reference(name);
	}
}
