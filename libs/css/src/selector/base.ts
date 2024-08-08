import type { Display } from "@xeho91/lib-type/trait/display";

import type { SelectorType } from "#selector";
import { SelectorsJoint } from "#selector/joint";
import { SelectorsList } from "#selectors-list";

export abstract class SelectorBase<TType extends SelectorType = SelectorType> implements Display {
	public readonly type: TType;

	protected constructor(type: TType) {
		this.type = type;
	}

	public abstract toString(): string;

	public to_joint(): SelectorsJoint<[typeof this]> {
		return new SelectorsJoint(this);
	}

	public to_list(): SelectorsList<[typeof this]> {
		return new SelectorsList(this);
	}
}
