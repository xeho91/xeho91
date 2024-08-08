import { unrecognized } from "@xeho91/lib-error/unrecognized";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { ReadonlyTuple } from "@xeho91/lib-type/tuple";

import { Property } from "#property";
import { BoxShadow, BoxShadowLayer } from "#property/box-shadow";
import { TextShadow, TextShadowLayer } from "#property/text-shadow";
import { Reference } from "#reference";
import type { Var } from "#function/var";

export type ShadowTargetName = IterableElement<typeof ShadowTarget.NAMES>;
export type ShadowPropertyName = IterableElement<typeof ShadowTarget.ATOMIC_PROPERTIES>;

export class ShadowTarget<TName extends ShadowTargetName = ShadowTargetName> {
	public static readonly NAMES = readonly_set([
		//
		"box-shadow",
		"text-shadow",
	]);

	public static [Symbol.iterator](): IterableIterator<ShadowTargetName> {
		return ShadowTarget.NAMES[Symbol.iterator]();
	}

	// TODO: Use set union when Node.js v22 becomes LTS
	public static ATOMIC_PROPERTIES = readonly_set([
		//
		"x",
		"y",
		"blur",
		"spread",
		"color",
	]);

	public static get_target_property_instance = <TTarget extends ShadowTargetName>(
		target: TTarget,
	): GetProperty<TTarget> => {
		// biome-ignore format: Prettier
		switch (target) {
			case "box-shadow": return BoxShadow as GetProperty<TTarget>;
			case "text-shadow": return TextShadow as GetProperty<TTarget>;
			default: throw unrecognized(target);
		}
	};

	public static create_layers = <TTarget extends ShadowTargetName, TLayerCount extends number>(
		target: TTarget,
		count: TLayerCount,
	): LayersTuple<TTarget, TLayerCount> =>
		Array.from({ length: count }, (_, index) => {
			const number = index + 1;
			// biome-ignore format: Prettier
			switch (target) {
				case "box-shadow": return BoxShadow.layer.create_reference(number).to_var();
				case "text-shadow": return TextShadow.layer.create_reference(number).to_var();
				default: throw unrecognized(target);
			}
		}) as LayersTuple<TTarget, TLayerCount>;

	public static create_atomized_layer = <TTarget extends ShadowTargetName, TNumber extends number>(
		target: TTarget,
		number: TNumber,
	): AtomizedLayer<TTarget> => {
		// biome-ignore format: Prettier
		switch (target) {
			case "box-shadow": return BoxShadowLayer.create_atomized(number) as AtomizedLayer<TTarget>;
			case "text-shadow": return TextShadowLayer.create_atomized_layer(number) as AtomizedLayer<TTarget>;
			default: throw unrecognized(target);
		}
	};

	public readonly name: TName;

	constructor(name: TName) {
		this.name = name;
	}

	public create_reference<TSuffix extends string>(suffix: TSuffix): Reference<`${TName}-${TSuffix}`> {
		const { name } = this;
		return new Reference(`${name}-${suffix}`);
	}

	public to_property(): Property<TName> {
		const { name } = this;
		return new Property(name);
	}
}

type GetProperty<TTarget extends ShadowTargetName> = TTarget extends "box-shadow"
	? typeof BoxShadow
	: TTarget extends "text-shadow"
		? typeof TextShadow
		: never;

type LayersTuple<TTarget extends ShadowTargetName, TLayerCount extends number> = TTarget extends "box-shadow"
	? ReadonlyTuple<Var<ReturnType<typeof BoxShadowLayer.create_reference>>, TLayerCount>
	: TTarget extends "text-shadow"
		? ReadonlyTuple<Var<ReturnType<typeof TextShadowLayer.create_reference>>, TLayerCount>
		: never;

type AtomizedLayer<TTarget extends ShadowTargetName> = TTarget extends "box-shadow"
	? ReturnType<typeof BoxShadowLayer.create_atomized>
	: TTarget extends "text-shadow"
		? ReturnType<typeof TextShadowLayer.create_atomized_layer>
		: never;
