import { FunctionBase, FunctionChildren } from "#function";
import type { Identifier } from "#identifier";
import { Operator } from "#operator";
import type { Reference } from "#reference";

type Value = Identifier;

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
