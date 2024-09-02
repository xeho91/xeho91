import { FunctionBase, FunctionChildren } from "#function";
import { Operator } from "#operator";
import { Reference } from "#reference";
import { Value } from "#value";
import { NumberCSS } from "#value/number";

export class Var<
	TReference extends Reference = Reference,
	TFallback extends Value | undefined = undefined,
> extends FunctionBase<"var"> {
	public reference: TReference;
	public fallback: TFallback;

	constructor(reference: TReference, fallback?: TFallback) {
		super("var");
		this.reference = reference;
		this.fallback = fallback as TFallback;
	}

	public get children(): Children<TReference, TFallback> {
		const { reference, fallback } = this;
		if (fallback) {
			return new FunctionChildren(
				//
				reference,
				Operator.COMMA,
				fallback,
			) as Children<TReference, TFallback>;
		}
		return new FunctionChildren(reference) as Children<TReference, TFallback>;
	}
}

type Children<TReference extends Reference, TFallback extends Value | undefined> = TFallback extends Value
	? FunctionChildren<[TReference, Operator<",">, TFallback]>
	: FunctionChildren<[TReference]>;

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(Var.name, () => {
		describe("constructor", () => {
			it("allows constructing without fallback", ({ expect }) => {
				const variable = new Var(new Reference("foo"));
				expect(variable).toBeInstanceOf(Var);
				expect(variable.fallback).toBeUndefined();
				expectTypeOf(variable).toEqualTypeOf<Var<Reference<"foo">>>();
			});

			it("allows constructing with fallback", ({ expect }) => {
				const variable = new Var(new Reference("foo"), new NumberCSS(0).to_value());
				expect(variable).toBeInstanceOf(Var);
				expect(variable.fallback).toBeInstanceOf(Value);
				expectTypeOf(variable).toEqualTypeOf<Var<Reference<"foo">, Value<[NumberCSS<0>]>>>();
			});
		});
	});
}
