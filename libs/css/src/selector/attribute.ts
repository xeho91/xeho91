import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import type { AttributeSelector } from "css-tree";

import type { Join } from "@xeho91/lib-type/array";
import type { Identifier } from "#identifier";
import { SelectorBase } from "#selector/base";
import type { StringCSS } from "#value/string";

type Value = string | number | boolean;
// TODO: Idea: could create map with aliases for these operators
export type AttributeMatcher = "=" | "~=" | "|=" | "^=" | "$=" | "*=";
// TODO: Idea: could create map with aliases for these modifiers
export type AttributeFlags = "i" | "s";

export class SelectorAttribute<
		TName extends Identifier = Identifier,
		TMatcher extends AttributeMatcher | undefined = undefined,
		TValue extends Identifier | StringCSS | undefined = undefined,
		TFlags extends AttributeFlags[] | undefined = undefined,
	>
	extends SelectorBase<"attribute">
	implements Display
{
	public name: TName;
	public matcher: TMatcher | undefined;
	public value: TValue | undefined;
	public flags: TFlags | undefined;

	constructor(name: TName, data: { matcher?: TMatcher; value?: TValue; flags?: TFlags } = {}) {
		super("attribute");
		const { matcher, value, flags } = data;
		this.name = name;
		this.matcher = matcher;
		this.value = value;
		this.flags = flags;
	}

	public override toString(): Stringified<TName, TMatcher, TValue, TFlags> {
		const { name, matcher, value, flags } = this;
		let results = name.toString();
		if (value) {
			results += matcher;
			results += `"${value}"`;
		}
		if (flags) {
			results += " ";
			results += flags.join("");
		}
		return `[${results}]` as Stringified<TName, TMatcher, TValue, TFlags>;
	}

	/*@__NO_SIDE_EFFECTS__*/
	public override to_ast(): AttributeSelector {
		const { name, matcher, value, flags } = this;
		return {
			type: "AttributeSelector",
			name: name.to_ast(),
			matcher: matcher ?? null,
			value: value?.to_ast() ?? null,
			flags: flags?.join("") ?? null,
		};
	}
}

type Stringified<
	TName extends Identifier,
	TMatcher extends AttributeMatcher | undefined,
	TValue extends Identifier | StringCSS | undefined,
	TFlags extends AttributeFlags[] | undefined,
> = TValue extends Value
	? TFlags extends AttributeFlags[]
		? `[${ToString<TName>}${TMatcher}"${TValue}" ${JoinedFlags<TFlags>}]`
		: `[${ToString<TName>}${TMatcher}"${TValue}"]`
	: TFlags extends AttributeFlags[]
		? `[${ToString<TName>} ${JoinedFlags<TFlags>}]`
		: `[${ToString<TName>}]`;

type JoinedFlags<TFlags extends AttributeFlags[]> = Join<TFlags, "">;
