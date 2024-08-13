import type { Display } from "@xeho91/lib-type/trait/display";
import type { CssNode } from "css-tree";

import type { ToAST } from "#ast";
import type { SelectorKind } from "#selector";
import { SelectorsJoint } from "#selector/joint";
import { SelectorsList } from "#selector/list";

export abstract class SelectorBase<TKind extends SelectorKind = SelectorKind> implements Display, ToAST {
	public readonly kind: TKind;

	protected constructor(type: TKind) {
		this.kind = type;
	}

	public abstract toString(): string;

	/*@__NO_SIDE_EFFECTS__*/
	public abstract to_ast(): CssNode;

	public to_joint(): SelectorsJoint<[typeof this]> {
		return new SelectorsJoint(this);
	}

	public to_list(): SelectorsList<[typeof this]> {
		return new SelectorsList(this);
	}
}
