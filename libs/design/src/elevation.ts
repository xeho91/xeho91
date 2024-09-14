import { AtProperty } from "@xeho91/lib-css/at-rule/property";
import { Block } from "@xeho91/lib-css/block";
import { Alpha } from "@xeho91/lib-css/data-type/alpha";
import { Chroma } from "@xeho91/lib-css/data-type/chroma";
import { Hue } from "@xeho91/lib-css/data-type/hue";
import { Lightness } from "@xeho91/lib-css/data-type/lightness";
import { Declaration } from "@xeho91/lib-css/declaration";
import { LightDark } from "@xeho91/lib-css/function/light-dark";
import { Oklch } from "@xeho91/lib-css/function/oklch";
import type { Var } from "@xeho91/lib-css/function/var";
import { Identifier } from "@xeho91/lib-css/identifier";
import { Reference } from "@xeho91/lib-css/reference";
import { Ruleset } from "@xeho91/lib-css/ruleset";
import { Selector } from "@xeho91/lib-css/selector";
import { SelectorClass } from "@xeho91/lib-css/selector/class";
import type { PseudoClassName } from "@xeho91/lib-css/selector/pseudo-class";
import type { PseudoElementName } from "@xeho91/lib-css/selector/pseudo-element";
import { Syntax } from "@xeho91/lib-css/syntax";
import { ColorTarget } from "@xeho91/lib-css/target/color";
import { type ShadowPropertyName, ShadowTarget } from "@xeho91/lib-css/target/shadow";
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { Percentage } from "@xeho91/lib-css/value/percentage";
import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { Color, type ColorScheme } from "#color";
import { DesignToken } from "#token";

export type ElevationLevel = IterableElement<typeof Elevation.LEVELS>;
export type ElevationLayer = IterableElement<typeof Elevation.LAYERS>;

type ElevationValue = Record<ElevationLayer, ElevationLayerProperties>;

function build_layer_properties<
	TX extends number,
	TY extends number,
	TBlur extends number,
	TSpread extends number,
	TAlpha extends number,
>(data: { x: TX; y: TY; blur: TBlur; spread: TSpread; alpha: TAlpha }) {
	const { x, y, spread, blur, alpha } = data;
	return {
		x: new Dimension(x, "px"),
		y: new Dimension(y, "px"),
		blur: new Dimension(blur, "px"),
		spread: new Dimension(spread, "px"),
		"color-alpha": new Alpha(new Percentage(alpha)),
	};
}
type ElevationLayerProperties = ReturnType<typeof build_layer_properties>;

type Name = typeof Elevation.NAME;

export class Elevation<
	TLevel extends ElevationLevel = ElevationLevel,
	const TValue extends ElevationValue = ElevationValue,
> extends DesignToken<Name, TLevel, TValue> {
	public static readonly NAME = "elevation";

	public static readonly VALUE = readonly_object({
		0: {
			1: build_layer_properties({ x: 0, y: 0, blur: 0, spread: 0, alpha: 0 }),
			2: build_layer_properties({ x: 0, y: 0, blur: 0, spread: 0, alpha: 0 }),
			3: build_layer_properties({ x: 0, y: 0, blur: 0, spread: 0, alpha: 0 }),
		},
		1: {
			1: build_layer_properties({ x: 0, y: 1, blur: 1, spread: -0.5, alpha: 65 }),
			2: build_layer_properties({ x: 0, y: 2, blur: 2, spread: -1, alpha: 70 }),
			3: build_layer_properties({ x: 0, y: 4, blur: 4, spread: -2, alpha: 75 }),
		},
		2: {
			1: build_layer_properties({ x: 0, y: 2, blur: 2, spread: -1, alpha: 62.5 }),
			2: build_layer_properties({ x: 0, y: 4, blur: 4, spread: -2, alpha: 67.5 }),
			3: build_layer_properties({ x: 0, y: 8, blur: 8, spread: -4, alpha: 72.5 }),
		},
		3: {
			1: build_layer_properties({ x: 0, y: 4, blur: 4, spread: -2, alpha: 60 }),
			2: build_layer_properties({ x: 0, y: 8, blur: 8, spread: -4, alpha: 65 }),
			3: build_layer_properties({ x: 0, y: 16, blur: 16, spread: -8, alpha: 70 }),
		},
		4: {
			1: build_layer_properties({ x: 0, y: 8, blur: 8, spread: -4, alpha: 57.5 }),
			2: build_layer_properties({ x: 0, y: 16, blur: 16, spread: -8, alpha: 62.5 }),
			3: build_layer_properties({ x: 0, y: 24, blur: 24, spread: -12, alpha: 67.5 }),
		},
		5: {
			1: build_layer_properties({ x: 0, y: 16, blur: 16, spread: -8, alpha: 55 }),
			2: build_layer_properties({ x: 0, y: 24, blur: 24, spread: -12, alpha: 60 }),
			3: build_layer_properties({ x: 0, y: 32, blur: 32, spread: -18, alpha: 65 }),
		},
	});

	public static readonly LEVELS = readonly_set(object_keys(Elevation.VALUE));

	public static [Symbol.iterator](): IterableIterator<ElevationLevel> {
		return Elevation.LEVELS[Symbol.iterator]();
	}

	public static readonly LAYERS = readonly_set([1, 2, 3]);

	public static readonly DEFAULT = 0 satisfies ElevationLevel;

	public static default = () => Elevation.get(Elevation.DEFAULT);

	public static get = <TLevel extends ElevationLevel>(
		level: TLevel,
	): Elevation<TLevel, (typeof Elevation.VALUE)[TLevel]> => {
		const cached = Elevation.CONSTRUCTED.get(level);
		// @ts-expect-error Not worth it to use assertion
		if (cached) return cached;
		return new Elevation(level, Elevation.VALUE[level]);
	};

	static #create_layer_color_reference = <
		TTarget extends ShadowTarget,
		TLayerNumber extends number,
		TScheme extends ColorScheme,
	>(
		target: TTarget,
		layer_number: TLayerNumber,
		scheme: TScheme,
	) => {
		const reference = target.create_reference(`${layer_number}-color-${scheme}`);
		new AtProperty(reference, {
			syntax: new Syntax("color"),
			initial_value: new Identifier("transparent").to_value(),
			inherits: true,
		});
		return reference;
	};

	static #create_color_oklch = <TTarget extends ShadowTarget, TNumber extends number, TScheme extends ColorScheme>(
		target: TTarget,
		layer_number: TNumber,
		scheme: TScheme,
	): Oklch => {
		const reference = Elevation.#create_layer_color_reference(target, layer_number, scheme);
		return new Oklch({
			lightness: Lightness.from_reference(reference),
			chroma: Chroma.from_reference(reference),
			hue: Hue.from_reference(reference),
			alpha: Alpha.from_reference(reference),
		});
	};

	static #create_light_dark_reference = <
		TTarget extends ShadowTarget,
		TNumber extends number,
		TScheme extends ColorScheme,
	>(
		target: TTarget,
		layer_number: TNumber,
		scheme: TScheme,
	) => {
		const reference = target.create_reference(`${layer_number}-color-${scheme}`);
		new AtProperty(reference, {
			syntax: new Syntax("color"),
			initial_value: new Identifier("transparent").to_value(),
			inherits: true,
		});
		return reference;
	};

	static #create_color_light_dark = <TTarget extends ShadowTarget, TLayerNumber extends number>(
		target: TTarget,
		layer_number: TLayerNumber,
	): LightDark<Var, Var> => {
		return new LightDark(
			Elevation.#create_light_dark_reference(target, layer_number, "light").to_var(),
			Elevation.#create_light_dark_reference(target, layer_number, "dark").to_var(),
		);
	};

	static #build_class_ruleset_block = <TTarget extends Target>(target: TTarget): Block => {
		const shadow_target = new ShadowTarget(target);
		// biome-ignore lint/style/useConst: Readability - mutation
		let block = new Block<Declaration[]>();
		const layers = ShadowTarget.create_layers(target, 3);
		for (const [index, layer_var] of layers.entries()) {
			const layer_number = index + 1;
			const atomized = ShadowTarget.create_atomized_layer(target, layer_number);
			const { color } = atomized;
			const light_dark = Elevation.#create_color_light_dark(shadow_target, layer_number);
			for (const scheme of Color.SCHEMES) {
				block.children.push(
					new Declaration(
						light_dark[scheme].reference.to_property(),
						Elevation.#create_color_oklch(shadow_target, layer_number, scheme).to_value(),
					),
				);
			}
			block.children.push(
				new Declaration(color.value.reference.to_property(), light_dark.to_value()),
				new Declaration(layer_var.reference.to_property(), atomized.to_value()),
			);
		}
		const property_instance = ShadowTarget.get_target_property_instance(target);
		// @ts-expect-error WARN: hard to type
		const { declaration } = new property_instance(...layers);
		block.children.push(declaration);
		return block;
	};

	public static class = <
		TTarget extends Target,
		TPseudoClass extends PseudoClassName | undefined = undefined,
		TPseudoElement extends PseudoElementName | undefined = undefined,
	>(
		target: TTarget,
		options: { pseudo_class?: TPseudoClass; pseudo_element?: TPseudoElement } = {},
	): SelectorClass<TTarget> => {
		const { pseudo_class, pseudo_element } = options;
		const shadow_target = new ShadowTarget(target);
		// biome-ignore lint/style/useConst: Readability - mutation
		let selector = Selector.class(shadow_target.name);
		if (pseudo_class) selector.add_suffix(pseudo_class);
		if (pseudo_element) selector.add_suffix(pseudo_element);
		if (Elevation.RULESETS.has(selector.name)) return selector;
		const ruleset = new Ruleset(
			DesignToken.create_selector_joint(selector, options).to_list(),
			Elevation.#build_class_ruleset_block(target),
		);
		DesignToken.add_property_ruleset(selector, ruleset);
		return selector;
	};

	constructor(level: TLevel, value: TValue) {
		super({ name: Elevation.NAME, variant: level, value });
	}

	public set_target<TTarget extends Target>(target: TTarget): ShadowTarget<TTarget> {
		return new ShadowTarget(target);
	}

	// FIXME: Cannot use `#` because it fails at runtime with `create_global_ruleset()` - What the...?
	private create_shadow_property_reference<TName extends ShadowPropertyName, TNumber extends number>(
		name: TName,
		layer_number: TNumber,
	): Reference {
		// biome-ignore lint/style/useConst: Readability - mutation
		let { reference } = this;
		if (name === "color") return reference.add_suffix(`${name}-${layer_number}-alpha`);
		return reference.add_suffix(`${name}-${layer_number}`);
	}

	public create_global_ruleset(): Ruleset {
		const { key, value } = this;
		const from_map = Elevation.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const block = new Block<Declaration[]>();
		for (const name of ShadowTarget.ATOMIC_PROPERTIES) {
			const value_key = name === "color" ? "color-alpha" : name;
			for (const layer_number of Elevation.LAYERS) {
				block.children.push(
					new Declaration(
						this.create_shadow_property_reference(name, layer_number).to_property(),
						value[layer_number][value_key].to_value(),
					),
				);
			}
		}
		const ruleset = new Ruleset(selector.to_list(), block);
		this.add_global_ruleset(ruleset);
		return ruleset;
	}

	#create_class_block_for_color<TTarget extends ShadowTarget, TNumber extends number>(
		target: TTarget,
		layer_number: TNumber,
	): Block<Declaration[]> {
		// biome-ignore lint/style/useConst: Readability - mutation
		let block = new Block<Declaration[]>();
		for (const color_property of Oklch) {
			for (const scheme of Color.SCHEMES) {
				if (color_property === "alpha") {
					block.children.push(
						new Declaration(
							Elevation.#create_light_dark_reference(target, layer_number, scheme)
								.add_suffix(color_property)
								.to_property(),
							this.create_shadow_property_reference("color", layer_number).to_var().to_value(),
						),
					);
				} else {
					const value_reference = new ColorTarget(target.name).create_reference(
						`${scheme}-${color_property}`,
					);
					// biome-ignore format: Prettier
					switch (color_property) {
						case "lightness": Lightness.create_at_property(value_reference); break;
						case "chroma": Chroma.create_at_property(value_reference); break;
						case "hue": Hue.create_at_property(value_reference); break;
					}
					block.children.push(
						new Declaration(
							Elevation.#create_layer_color_reference(target, layer_number, scheme)
								.add_suffix(color_property)
								.to_property(),
							value_reference.to_var().to_value(),
						),
					);
				}
			}
		}
		return block;
	}

	protected create_class_block<TTarget extends ShadowTarget>(target: TTarget): Block {
		const property_instance = ShadowTarget.get_target_property_instance(target.name);
		// biome-ignore lint/style/useConst: Readability - mutation
		let block = new Block<Declaration[]>();
		for (const name of property_instance.layer) {
			for (const layer_number of Elevation.LAYERS) {
				if (name === "color") {
					block.children.push(...this.#create_class_block_for_color(target, layer_number).children);
				} else {
					block.children.push(
						new Declaration(
							new Reference(`${target.name}-${layer_number}-${name}`).to_property(),
							this.create_shadow_property_reference(name, layer_number).to_var().to_value(),
						),
					);
				}
			}
		}
		return block;
	}

	public class<
		TTarget extends Target,
		TPseudoClass extends PseudoClassName | undefined = undefined,
		TPseudoElement extends PseudoElementName | undefined = undefined,
	>(raw_target: TTarget, options: { pseudo_class?: TPseudoClass; pseudo_element?: TPseudoElement } = {}) {
		const target = this.set_target(raw_target);
		const { name: prefix } = target;
		return this.create_selector_class({
			...options,
			target,
			prefix,
		});
	}
}

type Target = ConstructorParameters<typeof ShadowTarget>[0];

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(Elevation.name, () => {
		describe("static [Symbol.iterator]", () => {
			it("iterates through available keys", ({ expect }) => {
				for (const level of Elevation) {
					expect(Elevation.LEVELS.has(level)).toBe(true);
					expectTypeOf(level).toEqualTypeOf<ElevationLevel>();
				}
			});
		});

		describe("static class(target, options?)", () => {
			it("on call subscriber receive [selector, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("box-shadow");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`".box-shadow{--box-shadow-1-color-light:oklch(var(--box-shadow-1-color-light-lightness) var(--box-shadow-1-color-light-chroma) var(--box-shadow-1-color-light-hue) / var(--box-shadow-1-color-light-alpha));--box-shadow-1-color-dark:oklch(var(--box-shadow-1-color-dark-lightness) var(--box-shadow-1-color-dark-chroma) var(--box-shadow-1-color-dark-hue) / var(--box-shadow-1-color-dark-alpha));--box-shadow-1-color:light-dark(var(--box-shadow-1-color-light) , var(--box-shadow-1-color-dark));--box-shadow-1:var(--box-shadow-1-x) var(--box-shadow-1-y) var(--box-shadow-1-blur) var(--box-shadow-1-spread) var(--box-shadow-1-color);--box-shadow-2-color-light:oklch(var(--box-shadow-2-color-light-lightness) var(--box-shadow-2-color-light-chroma) var(--box-shadow-2-color-light-hue) / var(--box-shadow-2-color-light-alpha));--box-shadow-2-color-dark:oklch(var(--box-shadow-2-color-dark-lightness) var(--box-shadow-2-color-dark-chroma) var(--box-shadow-2-color-dark-hue) / var(--box-shadow-2-color-dark-alpha));--box-shadow-2-color:light-dark(var(--box-shadow-2-color-light) , var(--box-shadow-2-color-dark));--box-shadow-2:var(--box-shadow-2-x) var(--box-shadow-2-y) var(--box-shadow-2-blur) var(--box-shadow-2-spread) var(--box-shadow-2-color);--box-shadow-3-color-light:oklch(var(--box-shadow-3-color-light-lightness) var(--box-shadow-3-color-light-chroma) var(--box-shadow-3-color-light-hue) / var(--box-shadow-3-color-light-alpha));--box-shadow-3-color-dark:oklch(var(--box-shadow-3-color-dark-lightness) var(--box-shadow-3-color-dark-chroma) var(--box-shadow-3-color-dark-hue) / var(--box-shadow-3-color-dark-alpha));--box-shadow-3-color:light-dark(var(--box-shadow-3-color-light) , var(--box-shadow-3-color-dark));--box-shadow-3:var(--box-shadow-3-x) var(--box-shadow-3-y) var(--box-shadow-3-blur) var(--box-shadow-3-spread) var(--box-shadow-3-color);box-shadow:var(--box-shadow-1) , var(--box-shadow-2) , var(--box-shadow-3);}"`,
					);
				});
				Elevation.on("create-property-ruleset").subscribe({
					next: observer,
				});
				Elevation.class("box-shadow");
				Elevation.class("box-shadow");
				expect(observer).toHaveBeenCalledOnce();
			});
		});

		describe("static get(level)", () => {
			it("returns default when no name provided", ({ expect }) => {
				const level = Elevation.default();
				expect(level).toBeInstanceOf(Elevation);
			});

			it("on constructed instance subscriber receive instance", ({ expect }) => {
				const observer = vi.fn((instance) => {
					expect(instance).toBeInstanceOf(Elevation);
				});
				Elevation.on("construct").subscribe({
					next: observer,
				});
				Elevation.get(1);
				expect(observer).toHaveBeenCalled();
			});

			it("returns a Elevation instance for each key", ({ expect }) => {
				for (const level of Elevation) {
					const instance = Elevation.get(level);
					expect(instance).toBeInstanceOf(Elevation);
					expectTypeOf(instance).toMatchTypeOf<Elevation<ElevationLevel, ElevationValue>>();
				}
			});

			it("it got cached in the CONSTRUCTED", ({ expect }) => {
				for (const level of Elevation) {
					expect(Elevation.CONSTRUCTED.has(`elevation-${level}`)).toBe(true);
				}
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const space = Elevation.default();
				const global = space.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(
					`":root{--elevation-0-x-1:0px;--elevation-0-x-2:0px;--elevation-0-x-3:0px;--elevation-0-y-1:0px;--elevation-0-y-2:0px;--elevation-0-y-3:0px;--elevation-0-blur-1:0px;--elevation-0-blur-2:0px;--elevation-0-blur-3:0px;--elevation-0-spread-1:0px;--elevation-0-spread-2:0px;--elevation-0-spread-3:0px;--elevation-0-color-1-alpha:0%;--elevation-0-color-2-alpha:0%;--elevation-0-color-3-alpha:0%;}"`,
				);
			});

			it("created rulesets in Elevation.GLOBAL_RULESETS", ({ expect }) => {
				for (const level of Elevation) {
					const elevation = Elevation.get(level);
					elevation.create_global_ruleset();
					expect(Elevation.GLOBAL_RULESETS.has(level)).toBe(true);
				}
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("elevation-0");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`":root{--elevation-0-x-1:0px;--elevation-0-x-2:0px;--elevation-0-x-3:0px;--elevation-0-y-1:0px;--elevation-0-y-2:0px;--elevation-0-y-3:0px;--elevation-0-blur-1:0px;--elevation-0-blur-2:0px;--elevation-0-blur-3:0px;--elevation-0-spread-1:0px;--elevation-0-spread-2:0px;--elevation-0-spread-3:0px;--elevation-0-color-1-alpha:0%;--elevation-0-color-2-alpha:0%;--elevation-0-color-3-alpha:0%;}"`,
					);
				});
				Elevation.on("create-global-ruleset").subscribe({
					next: observer,
				});
				const elevation = Elevation.default();
				elevation.create_global_ruleset();
				expect(observer).toHaveBeenCalled();
			});
		});

		describe("class(target, options?)", () => {
			it("returns correctly when first argument target provided", ({ expect }) => {
				const elevation = Elevation.default();
				const class_name = elevation.class("text-shadow");
				const expected_name = "text-shadow-elevation-0";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const elevation = Elevation.default();
				const class_name = elevation.class("box-shadow", { pseudo_class: "hover" });
				const expected_name = "box-shadow-elevation-0-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const elevation = Elevation.default();
				const class_name = elevation.class("text-shadow", { pseudo_element: "after" });
				const expected_name = "text-shadow-elevation-0-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const elevation = Elevation.default();
				const class_name = elevation.class("box-shadow", {
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "box-shadow-elevation-0-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in Elevation.RULESETS", ({ expect }) => {
				const elevation = Elevation.default();
				const class_name = elevation.class("box-shadow");
				const ruleset = Elevation.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toMatchInlineSnapshot(
					`".box-shadow-elevation-0{--box-shadow-1-x:var(--elevation-0-x-1);--box-shadow-2-x:var(--elevation-0-x-2);--box-shadow-3-x:var(--elevation-0-x-3);--box-shadow-1-y:var(--elevation-0-y-1);--box-shadow-2-y:var(--elevation-0-y-2);--box-shadow-3-y:var(--elevation-0-y-3);--box-shadow-1-blur:var(--elevation-0-blur-1);--box-shadow-2-blur:var(--elevation-0-blur-2);--box-shadow-3-blur:var(--elevation-0-blur-3);--box-shadow-1-spread:var(--elevation-0-spread-1);--box-shadow-2-spread:var(--elevation-0-spread-2);--box-shadow-3-spread:var(--elevation-0-spread-3);--box-shadow-1-color-light-lightness:var(--box-shadow-color-light-lightness);--box-shadow-1-color-dark-lightness:var(--box-shadow-color-dark-lightness);--box-shadow-1-color-light-chroma:var(--box-shadow-color-light-chroma);--box-shadow-1-color-dark-chroma:var(--box-shadow-color-dark-chroma);--box-shadow-1-color-light-hue:var(--box-shadow-color-light-hue);--box-shadow-1-color-dark-hue:var(--box-shadow-color-dark-hue);--box-shadow-1-color-light-alpha:var(--elevation-0-color-1-alpha);--box-shadow-1-color-dark-alpha:var(--elevation-0-color-1-alpha);--box-shadow-2-color-light-lightness:var(--box-shadow-color-light-lightness);--box-shadow-2-color-dark-lightness:var(--box-shadow-color-dark-lightness);--box-shadow-2-color-light-chroma:var(--box-shadow-color-light-chroma);--box-shadow-2-color-dark-chroma:var(--box-shadow-color-dark-chroma);--box-shadow-2-color-light-hue:var(--box-shadow-color-light-hue);--box-shadow-2-color-dark-hue:var(--box-shadow-color-dark-hue);--box-shadow-2-color-light-alpha:var(--elevation-0-color-2-alpha);--box-shadow-2-color-dark-alpha:var(--elevation-0-color-2-alpha);--box-shadow-3-color-light-lightness:var(--box-shadow-color-light-lightness);--box-shadow-3-color-dark-lightness:var(--box-shadow-color-dark-lightness);--box-shadow-3-color-light-chroma:var(--box-shadow-color-light-chroma);--box-shadow-3-color-dark-chroma:var(--box-shadow-color-dark-chroma);--box-shadow-3-color-light-hue:var(--box-shadow-color-light-hue);--box-shadow-3-color-dark-hue:var(--box-shadow-color-dark-hue);--box-shadow-3-color-light-alpha:var(--elevation-0-color-3-alpha);--box-shadow-3-color-dark-alpha:var(--elevation-0-color-3-alpha);}"`,
				);
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("box-shadow-elevation-5");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`".box-shadow-elevation-5{--box-shadow-1-x:var(--elevation-5-x-1);--box-shadow-2-x:var(--elevation-5-x-2);--box-shadow-3-x:var(--elevation-5-x-3);--box-shadow-1-y:var(--elevation-5-y-1);--box-shadow-2-y:var(--elevation-5-y-2);--box-shadow-3-y:var(--elevation-5-y-3);--box-shadow-1-blur:var(--elevation-5-blur-1);--box-shadow-2-blur:var(--elevation-5-blur-2);--box-shadow-3-blur:var(--elevation-5-blur-3);--box-shadow-1-spread:var(--elevation-5-spread-1);--box-shadow-2-spread:var(--elevation-5-spread-2);--box-shadow-3-spread:var(--elevation-5-spread-3);--box-shadow-1-color-light-lightness:var(--box-shadow-color-light-lightness);--box-shadow-1-color-dark-lightness:var(--box-shadow-color-dark-lightness);--box-shadow-1-color-light-chroma:var(--box-shadow-color-light-chroma);--box-shadow-1-color-dark-chroma:var(--box-shadow-color-dark-chroma);--box-shadow-1-color-light-hue:var(--box-shadow-color-light-hue);--box-shadow-1-color-dark-hue:var(--box-shadow-color-dark-hue);--box-shadow-1-color-light-alpha:var(--elevation-5-color-1-alpha);--box-shadow-1-color-dark-alpha:var(--elevation-5-color-1-alpha);--box-shadow-2-color-light-lightness:var(--box-shadow-color-light-lightness);--box-shadow-2-color-dark-lightness:var(--box-shadow-color-dark-lightness);--box-shadow-2-color-light-chroma:var(--box-shadow-color-light-chroma);--box-shadow-2-color-dark-chroma:var(--box-shadow-color-dark-chroma);--box-shadow-2-color-light-hue:var(--box-shadow-color-light-hue);--box-shadow-2-color-dark-hue:var(--box-shadow-color-dark-hue);--box-shadow-2-color-light-alpha:var(--elevation-5-color-2-alpha);--box-shadow-2-color-dark-alpha:var(--elevation-5-color-2-alpha);--box-shadow-3-color-light-lightness:var(--box-shadow-color-light-lightness);--box-shadow-3-color-dark-lightness:var(--box-shadow-color-dark-lightness);--box-shadow-3-color-light-chroma:var(--box-shadow-color-light-chroma);--box-shadow-3-color-dark-chroma:var(--box-shadow-color-dark-chroma);--box-shadow-3-color-light-hue:var(--box-shadow-color-light-hue);--box-shadow-3-color-dark-hue:var(--box-shadow-color-dark-hue);--box-shadow-3-color-light-alpha:var(--elevation-5-color-3-alpha);--box-shadow-3-color-dark-alpha:var(--elevation-5-color-3-alpha);}"`,
					);
				});
				Elevation.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const elevation = Elevation.get(5);
				elevation.class("box-shadow");
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}
