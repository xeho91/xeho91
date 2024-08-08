import "@xeho91/lib-type/reset";
import { unrecognized } from "@xeho91/lib-error/unrecognized";
import { readonly_set, unionize_sets } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { Property, type InferProperty, type ToProperty } from "#property";

type TargetGap = IterableElement<typeof GapTarget.TARGETS>;
export class GapTarget<TName extends TargetGap = TargetGap> implements ToProperty {
	public static readonly TARGETS = readonly_set([
		//
		"gap",
		"column-gap",
		"row-gap",
	]);

	public static [Symbol.iterator](): IterableIterator<TargetGap> {
		return GapTarget.TARGETS[Symbol.iterator]();
	}

	public static is_valid_name = (name: string): name is TargetGap => GapTarget.TARGETS.has(name);

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public to_property(): Property<TName> {
		const { name } = this;
		return new Property(name);
	}
}

type TargetInset = IterableElement<typeof InsetTarget.TARGETS>;
export class InsetTarget<TName extends TargetInset = TargetInset> implements ToProperty {
	public static readonly TARGETS = readonly_set([
		"inset",
		"inset-inline",
		"inset-inline-start",
		"inset-inline-end",
		"inset-block",
		"inset-block-start",
		"inset-block-end",
	]);

	public static [Symbol.iterator](): IterableIterator<TargetInset> {
		return InsetTarget.TARGETS[Symbol.iterator]();
	}

	public static is_valid_name = (name: string): name is TargetInset => InsetTarget.TARGETS.has(name);

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public to_property(): Property<TName> {
		const { name } = this;
		return new Property(name);
	}
}

type TargetMargin = IterableElement<typeof MarginTarget.TARGETS>;
export class MarginTarget<TName extends TargetMargin = TargetMargin> implements ToProperty {
	public static readonly TARGETS = readonly_set([
		"margin",
		"margin-inline",
		"margin-inline-start",
		"margin-inline-end",
		"margin-block",
		"margin-block-start",
		"margin-block-end",
	]);

	public static [Symbol.iterator](): IterableIterator<TargetMargin> {
		return MarginTarget.TARGETS[Symbol.iterator]();
	}

	public static is_valid_name = (name: string): name is TargetMargin => MarginTarget.TARGETS.has(name);

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public to_property(): Property<TName> {
		const { name } = this;
		return new Property(name);
	}
}

type TargetPadding = IterableElement<typeof PaddingTarget.TARGETS>;
export class PaddingTarget<TName extends TargetPadding = TargetPadding> implements ToProperty {
	public static readonly TARGETS = readonly_set([
		"padding",
		"padding-inline",
		"padding-inline-start",
		"padding-inline-end",
		"padding-block",
		"padding-block-start",
		"padding-block-end",
	]);

	public static [Symbol.iterator](): IterableIterator<TargetPadding> {
		return PaddingTarget.TARGETS[Symbol.iterator]();
	}

	public static is_valid_name = (name: string): name is TargetPadding => PaddingTarget.TARGETS.has(name);

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public to_property(): Property<TName> {
		const { name } = this;
		return new Property(name);
	}
}

type TargetWith = IterableElement<typeof WidthTarget.TARGETS>;
export class WidthTarget<TName extends TargetWith = TargetWith> implements ToProperty {
	public static readonly TARGETS = readonly_set([
		//
		"width",
		"max-width",
		"min-width",
	]);

	public static [Symbol.iterator](): IterableIterator<TargetWith> {
		return WidthTarget.TARGETS[Symbol.iterator]();
	}

	public static is_valid_name = (name: string): name is TargetWith => WidthTarget.TARGETS.has(name);

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public to_property(): Property<TName> {
		const { name } = this;
		return new Property(name);
	}
}

type TargetHeight = IterableElement<typeof HeightTarget.TARGETS>;
export class HeightTarget<TName extends TargetHeight = TargetHeight> implements ToProperty {
	public static readonly TARGETS = readonly_set([
		//
		"height",
		"max-height",
		"min-height",
	]);

	public static [Symbol.iterator](): IterableIterator<TargetHeight> {
		return HeightTarget.TARGETS[Symbol.iterator]();
	}

	public static is_valid_name = (name: string): name is TargetHeight => HeightTarget.TARGETS.has(name);

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public to_property(): Property<TName> {
		const { name } = this;
		return new Property(name);
	}
}

type Target = IterableElement<typeof SpaceTarget.TARGETS>;

export class SpaceTarget<TName extends Target = Target> implements ToProperty {
	public static readonly TARGETS = unionize_sets(
		readonly_set([
			//
			"border-spacing",
			"flex-basis",
			"text-indent",
			"translate",
		]),
		GapTarget.TARGETS,
		InsetTarget.TARGETS,
		MarginTarget.TARGETS,
		PaddingTarget.TARGETS,
		WidthTarget.TARGETS,
		HeightTarget.TARGETS,
	);

	public static [Symbol.iterator](): IterableIterator<Target> {
		return SpaceTarget.TARGETS[Symbol.iterator]();
	}

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public to_property(): TargetProperty<TName> {
		const { name } = this;
		// biome-ignore format: Prettier
		switch (name) {
			case "border-spacing":
			case "flex-basis":
			case "text-indent":
			case "translate": return new Property(name) as TargetProperty<TName>;
			default: {
				if (GapTarget.is_valid_name(name)) return new GapTarget(name).to_property() as TargetProperty<TName>;
				if (InsetTarget.is_valid_name(name)) return new InsetTarget(name).to_property() as TargetProperty<TName>;
				if (MarginTarget.is_valid_name(name)) return new MarginTarget(name).to_property() as TargetProperty<TName>;
				if (PaddingTarget.is_valid_name(name)) return new PaddingTarget(name).to_property() as TargetProperty<TName>;
				if (WidthTarget.is_valid_name(name)) return new WidthTarget(name).to_property() as TargetProperty<TName>;
				if (HeightTarget.is_valid_name(name)) return new HeightTarget(name).to_property() as TargetProperty<TName>;
				throw unrecognized(name);
			}
		}
	}
}

type TargetProperty<TName extends Target> = TName extends "border-spacing" | "flex-basis" | "text-indent" | "translate"
	? Property<TName>
	: TName extends TargetGap
		? InferProperty<GapTarget<TName>>
		: TName extends TargetInset
			? InferProperty<InsetTarget<TName>>
			: TName extends TargetMargin
				? InferProperty<MarginTarget<TName>>
				: TName extends TargetPadding
					? InferProperty<PaddingTarget<TName>>
					: TName extends TargetWith
						? InferProperty<WidthTarget<TName>>
						: TName extends TargetHeight
							? InferProperty<HeightTarget<TName>>
							: never;
