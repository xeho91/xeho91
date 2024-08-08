import { FunctionChildren, FunctionBase } from "#function";
import { Operator } from "#operator";
import type { Dimension } from "#value/dimension";
import type { Percentage } from "#value/percentage";

type Value = Dimension | Percentage;

export class Clamp<
	TMin extends Value = Value,
	TValue extends Value = Value,
	TMax extends Value = Value,
> extends FunctionBase<"clamp", Children<TMin, TValue, TMax>> {
	public min: TMin;
	public max: TMax;
	public value: TValue;

	constructor(data: {
		min: TMin;
		max: TMax;
		value: TValue;
	}) {
		super("clamp");
		const { min, max, value } = data;
		this.min = min;
		this.value = value;
		this.max = max;
	}

	public get children(): Children<TMin, TValue, TMax> {
		const { min, max, value } = this;
		return new FunctionChildren(
			//
			min,
			Operator.COMMA,
			value,
			Operator.COMMA,
			max,
		);
	}
}

type Children<TMin extends Value, TValue extends Value, TMax extends Value> = FunctionChildren<
	[
		//
		TMin,
		Operator<",">,
		TValue,
		Operator<",">,
		TMax,
	]
>;
