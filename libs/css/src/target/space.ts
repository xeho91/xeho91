import "@xeho91/lib-type/reset";
import { unrecognized } from "@xeho91/lib-error/unrecognized";
import { readonly_set, unionize_sets } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { type InferProperty, Property, type ToProperty } from "#property";

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
		"inset-block",
		"inset-block-end",
		"inset-block-start",
		"inset-inline",
		"inset-inline-end",
		"inset-inline-start",
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
		"margin-block",
		"margin-block-start",
		"margin-block-end",
		"margin-inline",
		"margin-inline-start",
		"margin-inline-end",
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

type TargetScrollMargin = IterableElement<typeof ScrollMarginTarget.TARGETS>;
export class ScrollMarginTarget<TName extends TargetScrollMargin = TargetScrollMargin> implements ToProperty {
	public static readonly TARGETS = readonly_set([
		"scroll-margin",
		"scroll-margin-block",
		"scroll-margin-block-start",
		"scroll-margin-block-end",
		"scroll-margin-inline",
		"scroll-margin-inline-start",
		"scroll-margin-inline-end",
	]);

	public static [Symbol.iterator](): IterableIterator<TargetScrollMargin> {
		return ScrollMarginTarget.TARGETS[Symbol.iterator]();
	}

	public static is_valid_name = (name: string): name is TargetScrollMargin => ScrollMarginTarget.TARGETS.has(name);

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

type TargetScrollPadding = IterableElement<typeof ScrollPaddingTarget.TARGETS>;
export class ScrollPaddingTarget<TName extends TargetScrollPadding = TargetScrollPadding> implements ToProperty {
	public static readonly TARGETS = readonly_set([
		"scroll-padding",
		"scroll-padding-inline",
		"scroll-padding-inline-start",
		"scroll-padding-inline-end",
		"scroll-padding-block",
		"scroll-padding-block-start",
		"scroll-padding-block-end",
	]);

	public static [Symbol.iterator](): IterableIterator<TargetScrollPadding> {
		return ScrollPaddingTarget.TARGETS[Symbol.iterator]();
	}

	public static is_valid_name = (name: string): name is TargetScrollPadding => ScrollPaddingTarget.TARGETS.has(name);

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public to_property(): Property<TName> {
		const { name } = this;
		return new Property(name);
	}
}

type TargetWidth = IterableElement<typeof WidthTarget.TARGETS>;
export class WidthTarget<TName extends TargetWidth = TargetWidth> implements ToProperty {
	public static readonly TARGETS = readonly_set([
		//
		"width",
		"max-width",
		"min-width",
	]);

	public static [Symbol.iterator](): IterableIterator<TargetWidth> {
		return WidthTarget.TARGETS[Symbol.iterator]();
	}

	public static is_valid_name = (name: string): name is TargetWidth => WidthTarget.TARGETS.has(name);

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
		ScrollMarginTarget.TARGETS,
		PaddingTarget.TARGETS,
		ScrollPaddingTarget.TARGETS,
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
				if (ScrollMarginTarget.is_valid_name(name)) return new ScrollMarginTarget(name).to_property() as TargetProperty<TName>;
				if (PaddingTarget.is_valid_name(name)) return new PaddingTarget(name).to_property() as TargetProperty<TName>;
				if (ScrollPaddingTarget.is_valid_name(name)) return new ScrollPaddingTarget(name).to_property() as TargetProperty<TName>;
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
				: TName extends TargetScrollMargin
					? InferProperty<ScrollMarginTarget<TName>>
					: TName extends TargetPadding
						? InferProperty<PaddingTarget<TName>>
						: TName extends TargetScrollPadding
							? InferProperty<ScrollPaddingTarget<TName>>
							: TName extends TargetWidth
								? InferProperty<WidthTarget<TName>>
								: TName extends TargetHeight
									? InferProperty<HeightTarget<TName>>
									: never;
