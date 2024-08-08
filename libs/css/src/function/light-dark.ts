import { FunctionChildren, FunctionBase } from "#function";
import { Operator } from "#operator";
import type { ToAST } from "#type";

type Value = ToAST;

export class LightDark<TLight extends Value = Value, TDark extends Value = Value> extends FunctionBase<"light-dark"> {
	public light: TLight;
	public dark: TDark;

	constructor(light: TLight, dark: TDark) {
		super("light-dark");
		this.light = light;
		this.dark = dark;
	}

	public get children(): Children<TLight, TDark> {
		const { light, dark } = this;
		return new FunctionChildren(light, Operator.COMMA, dark);
	}
}

type Children<TLight extends Value, TDark extends Value> = FunctionChildren<[TLight, Operator<",">, TDark]>;
