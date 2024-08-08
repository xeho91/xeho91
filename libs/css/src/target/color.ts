// WARN: `lint:ts` will not fail from this package root directory, but other libs will fail
import "@xeho91/lib-type/reset";

import { extract_set_entries, readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { Property } from "#property";
import { Reference } from "#reference";

type ColorPropertyName = IterableElement<typeof ColorProperty.NAMES>;

export class ColorProperty<TName extends ColorPropertyName = ColorPropertyName> {
	public static readonly NAMES = readonly_set([
		"lightness",
		"chroma",
		"hue",
		"alpha",
		"light",
		"dark",
		"light-lightness",
		"light-chroma",
		"light-hue",
		"light-alpha",
		"dark-lightness",
		"dark-chroma",
		"dark-hue",
		"dark-alpha",
	]);

	public static [Symbol.iterator](): IterableIterator<ColorPropertyName> {
		return ColorProperty.NAMES[Symbol.iterator]();
	}

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}
}

export type ColorTargetName = IterableElement<typeof ColorTarget.TARGETS>;

export class ColorTarget<TName extends ColorTargetName = ColorTargetName> {
	public static readonly TARGETS = readonly_set([
		"accent",
		"background",
		"border",
		"border-inline",
		"border-block",
		"border-top",
		"border-bottom",
		"border-left",
		"border-right",
		"border-block-start",
		"border-block-end",
		"border-inline-start",
		"border-inline-end",
		"box-shadow",
		"caret",
		"outline",
		"stroke",
		"text",
		"text-decoration",
		"text-shadow",
		"text-selection",
	]);

	public static readonly CUSTOM = Object.freeze(
		extract_set_entries(ColorTarget.TARGETS, ["box-shadow", "text-shadow"]),
	);

	public static [Symbol.iterator](): IterableIterator<ColorTargetName> {
		return ColorTarget.TARGETS[Symbol.iterator]();
	}

	public static is_valid_name(name: string): name is ColorTargetName {
		return ColorTarget.TARGETS.has(name);
	}

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public toString(): `${TName}-color` {
		const { name } = this;
		return `${name}-color` as const;
	}

	public create_reference<TSuffix extends string>(suffix: TSuffix): Reference<`${TName}-color-${TSuffix}`> {
		const { name } = this;
		return new Reference(`${name}-color-${suffix}`);
	}

	public to_property(): TargetProperty<TName> {
		const { name } = this;
		if (name === "text") return new Property("color") as TargetProperty<TName>;
		if (ColorTarget.CUSTOM.has(name)) return new Property(new Reference(name)) as TargetProperty<TName>;
		return new Property(`${name}-color`) as TargetProperty<TName>;
	}
}

type TargetProperty<TName extends ColorTargetName> = Property<
	TName extends "text"
		? "color"
		: TName extends IterableElement<typeof ColorTarget.CUSTOM>
			? Reference<TName>
			: `${TName}-color`
>;
