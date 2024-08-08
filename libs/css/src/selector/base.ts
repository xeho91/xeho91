import type { Display } from "@xeho91/lib-type/trait/display";

import type { SelectorKind } from "#selector";
import { SelectorsJoint } from "#selector/joint";
import { SelectorsList } from "#selector/list";

export abstract class SelectorBase<TKind extends SelectorKind = SelectorKind> implements Display {
	public readonly kind: TKind;

	protected constructor(type: TKind) {
		this.kind = type;
	}

	public abstract toString(): string;

	public to_joint(): SelectorsJoint<[typeof this]> {
		return new SelectorsJoint(this);
	}

	public to_list(): SelectorsList<[typeof this]> {
		return new SelectorsList(this);
	}
}
