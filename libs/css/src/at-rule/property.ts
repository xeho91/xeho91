import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import { type Atrule, type CssNode, List } from "css-tree";
import { Subject } from "rxjs/internal/Subject";
import { defer } from "rxjs/internal/observable/defer";

import type { ToAST } from "#ast";
import { AtRuleBase } from "#at-rule";
import { Block } from "#block";
import { Declaration } from "#declaration";
import { Identifier } from "#identifier";
import { Property } from "#property";
import type { Reference } from "#reference";
import type { Syntax } from "#syntax";
import type { Value } from "#value";
import { BooleanCSS } from "#value/boolean";
import type { StringCSS } from "#value/string";

/**
 * CSS _custom_ **property**.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/@property}
 */
export class AtProperty<
		TReference extends Reference = Reference,
		TSyntax extends Syntax = Syntax,
		TInitialValue extends Value = Value,
		TInherits extends boolean = boolean,
	>
	extends AtRuleBase<"property">
	implements Display, ToAST
{
	static readonly #NAME = "property";

	static readonly MAP = new Map<ToString<Reference>, AtProperty>();

	private static readonly SUBJECT = {
		construct: new Subject<AtProperty>(),
	} as const;

	public static on = <EventName extends keyof typeof AtProperty.SUBJECT>(eventName: EventName) =>
		defer(() => AtProperty.SUBJECT[eventName].asObservable());

	public readonly reference: TReference;
	public readonly syntax: TSyntax;
	public readonly initial_value: TInitialValue;
	public readonly inherits: BooleanCSS<TInherits>;

	constructor(
		reference: TReference,
		properties: { syntax: TSyntax; initial_value: TInitialValue; inherits: TInherits },
	) {
		super(AtProperty.#NAME);
		this.reference = reference;
		const { syntax, initial_value, inherits } = properties;
		this.syntax = syntax;
		this.initial_value = initial_value;
		this.inherits = new BooleanCSS(inherits);
		if (!AtProperty.MAP.has(reference.toString())) {
			AtProperty.SUBJECT.construct.next(this);
		}
	}

	public toString(): Stringified<TReference, TSyntax, TInitialValue, TInherits> {
		const { prefix, reference, block } = this;
		return `${prefix} ${reference.toString()} ${block.toString()}` as Stringified<
			TReference,
			TSyntax,
			TInitialValue,
			TInherits
		>;
	}

	public to_ast(): Atrule {
		const { reference, block } = this;
		const children = new List<CssNode>();
		children.push(new Identifier(reference.name).to_ast());
		return {
			type: "Atrule",
			name: AtProperty.#NAME,
			prelude: {
				type: "AtrulePrelude",
				children,
			},
			block: block.to_ast(),
		};
	}

	public get syntax_declaration(): Declaration<Property<"syntax">, Value<[StringCSS<ToString<TSyntax>>]>> {
		return new Declaration(new Property("syntax"), this.syntax.to_value() as Value<[StringCSS<ToString<TSyntax>>]>);
	}

	public get initial_value_declaration(): Declaration<Property<"initial-value">, TInitialValue> {
		return new Declaration(new Property("initial-value"), this.initial_value);
	}

	public get inherits_declaration(): Declaration<Property<"inherits">, Value<[BooleanCSS<TInherits>]>> {
		return new Declaration(new Property("inherits"), this.inherits.to_value());
	}

	public get block(): DeclarationBlock<TSyntax, TInitialValue, TInherits> {
		const { syntax_declaration, initial_value_declaration, inherits_declaration } = this;
		return new Block(
			//
			syntax_declaration,
			initial_value_declaration,
			inherits_declaration,
		);
	}
}

type DeclarationBlock<TSyntax extends Syntax, TInitialValue extends Value, TInherits extends boolean> = Block<
	[
		Declaration<Property<"syntax">, Value<[StringCSS<ToString<TSyntax>>]>>,
		Declaration<Property<"initial-value">, TInitialValue>,
		Declaration<Property<"inherits">, Value<[BooleanCSS<TInherits>]>>,
	]
>;

type Stringified<
	TReference extends Reference,
	TSyntax extends Syntax,
	TInitialValue extends Value,
	TInherits extends boolean,
> = `${AtProperty["prefix"]} ${ToString<TReference>} ${ToString<DeclarationBlock<TSyntax, TInitialValue, TInherits>>}`;

export interface ToAtProperty {
	to_at_property(...params: unknown[]): AtProperty;
}
