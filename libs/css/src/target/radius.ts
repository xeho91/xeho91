import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { Property } from "#property";

type Target = IterableElement<typeof RadiusTarget.TARGETS>;

export class RadiusTarget<TName extends Target = Target> {
	public static readonly TARGETS = readonly_set([
		"all",
		"end-end",
		"end-start",
		"start-end",
		"start-start",
		"top-left",
		"top-right",
		"bottom-left",
		"bottom-right",
	]);

	public static [Symbol.iterator](): IterableIterator<Target> {
		return RadiusTarget.TARGETS[Symbol.iterator]();
	}

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public to_property(): TargetProperty<TName> {
		const { name } = this;
		if (name === "all") return new Property("border-radius") as TargetProperty<TName>;
		return new Property(`border-${name}-radius`) as TargetProperty<TName>;
	}
}

type TargetProperty<TName extends Target> = Property<TName extends "all" ? "border-radius" : `border-${TName}-radius`>;
