import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { Property, type ToProperty } from "#property";

type Target = IterableElement<typeof StrokeTarget.TARGETS>;

export class StrokeTarget<TName extends Target = Target> implements ToProperty {
	public static readonly TARGETS = readonly_set([
		"all",
		"start",
		"end",
		"block",
		"block-start",
		"block-end",
		"inline",
		"inline-start",
		"inline-end",
		"top",
		"right",
		"bottom",
		"left",
	]);

	public static [Symbol.iterator](): IterableIterator<Target> {
		return StrokeTarget.TARGETS[Symbol.iterator]();
	}

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public to_property(): TargetProperty<TName> {
		const { name } = this;
		if (name === "all") return new Property("border-width") as TargetProperty<TName>;
		return new Property(`border-${name}-width`) as TargetProperty<TName>;
	}
}

type TargetProperty<TName extends Target> = Property<TName extends "all" ? "border-width" : `border-${TName}-width`>;
