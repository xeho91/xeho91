import { readonly_set } from "@xeho91/lib-snippet/set";

import type { ToAST } from "#ast";
import { AtProperty } from "#at-rule/property";
import { DataType } from "#data-type/type";
import type { Var } from "#function/var";
import { Reference } from "#reference";
import { ShadowTarget, type ShadowTargetName } from "#target/shadow";
import type { ToValue } from "#value";
import { Dimension } from "#value/dimension";
import { NumberCSS } from "#value/number";

type OffsetAxis = "x" | "y";

type OffsetValue = ToValue & ToAST;

type OffsetTargetName = ShadowTargetName;

export class Offset<TAxis extends OffsetAxis, TValue extends OffsetValue = OffsetValue> extends DataType<
	typeof Offset.NAME,
	TValue
> {
	public static readonly NAME = "offset";

	public static readonly AXES = readonly_set(["x", "y"]);

	public static [Symbol.iterator](): IterableIterator<OffsetAxis> {
		return Offset.AXES[Symbol.iterator]();
	}

	public static readonly DEFAULT_VALUE = new Dimension(0, "px");

	public static default = <TAxis extends OffsetAxis>(axis: TAxis) => new Offset(axis, Offset.DEFAULT_VALUE);

	public static create_reference = <TAxis extends OffsetAxis, TPrefix extends string>(
		axis: TAxis,
		prefix: TPrefix,
	): Reference<`${TPrefix}-${TAxis}`> => new Reference(`${prefix}-${axis}`);

	public static from_reference = <TAxis extends OffsetAxis, TReference extends Reference>(
		axis: TAxis,
		reference: TReference,
	): Offset<TAxis, Var<Reference>> => {
		new AtProperty(reference, {
			syntax: Offset.DEFAULT_VALUE.unit.syntax,
			initial_value: Offset.DEFAULT_VALUE.to_value(),
			inherits: true,
		});
		return new Offset(axis, reference.to_var());
	};

	public readonly axis: TAxis;

	constructor(axis: TAxis, value: TValue) {
		super(Offset.NAME, value);
		this.axis = axis;
	}

	public create_reference<TTargetName extends OffsetTargetName>(
		target: TTargetName,
	): Reference<`${TTargetName}-${TAxis}`> {
		const { axis } = this;
		return new ShadowTarget(target).create_reference(axis);
	}
}

if (import.meta.vitest) {
	const { describe, it, expectTypeOf } = import.meta.vitest;

	describe(Offset.name, () => {
		describe("create_reference(target_name)", () => {
			it("returns reference when target name is valid", ({ expect }) => {
				const offset = new Offset("x", new NumberCSS(0));
				const reference = offset.create_reference("box-shadow");
				expect(reference).toBeInstanceOf(Reference);
				expectTypeOf(reference).toEqualTypeOf<Reference<"box-shadow-x">>();
				expect(reference.name).toBe("box-shadow-x");
			});
		});
	});
}
