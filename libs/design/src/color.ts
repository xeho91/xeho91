import {
	type ColorCategory,
	type ColorCategoryFromName,
	Color as ColorInstance,
	type ColorName,
	type ColorNameFromCategory,
	type ColorScheme,
	type ColorStep,
	type ColorType,
} from "@xeho91/lib-color";
import { Block } from "@xeho91/lib-css/block";
import { Alpha } from "@xeho91/lib-css/data-type/alpha";
import { Chroma } from "@xeho91/lib-css/data-type/chroma";
import { Hue } from "@xeho91/lib-css/data-type/hue";
import { Lightness } from "@xeho91/lib-css/data-type/lightness";
import { Declaration } from "@xeho91/lib-css/declaration";
import { LightDark } from "@xeho91/lib-css/function/light-dark";
import { Oklch, type OklchPropertyName } from "@xeho91/lib-css/function/oklch";
import { Identifier } from "@xeho91/lib-css/identifier";
import { Ruleset } from "@xeho91/lib-css/ruleset";
import { Selector } from "@xeho91/lib-css/selector";
import { SelectorClass } from "@xeho91/lib-css/selector/class";
import type { PseudoClassName } from "@xeho91/lib-css/selector/pseudo-class";
import type { PseudoElementName } from "@xeho91/lib-css/selector/pseudo-element";
import { Syntax } from "@xeho91/lib-css/syntax";
import { ColorTarget } from "@xeho91/lib-css/target/color";
import { unrecognized } from "@xeho91/lib-error/unrecognized";

import type { Value } from "@xeho91/lib-css/value";
import { DesignToken } from "#token";

export type {
	ColorCategory,
	ColorCategoryFromName,
	ColorName,
	ColorNameFromCategory,
	ColorStep,
	ColorScheme,
	ColorType,
} from "@xeho91/lib-color";

type Variant<
	TCategory extends ColorCategory = ColorCategory,
	TName extends ColorNameFromCategory<TCategory> = ColorNameFromCategory<TCategory>,
	TType extends ColorType = ColorType,
	TStep extends ColorStep = ColorStep,
> = `${TCategory}-${TName extends ColorName ? TName : never}-${TType}-${TStep}`;

export class Color<
	TCategory extends ColorCategory = ColorCategory,
	TName extends ColorNameFromCategory<TCategory> = ColorNameFromCategory<TCategory>,
	TType extends ColorType = ColorType,
	TStep extends ColorStep = ColorStep,
> extends DesignToken<
	"color",
	Variant<TCategory, TName, TType, TStep>,
	{
		category: TCategory;
		name: TName;
		type: TType;
		step: TStep;
	}
> {
	public static readonly NAME = "color";
	public static readonly CATEGORIES = ColorInstance.CATEGORIES;
	public static readonly NAMES = ColorInstance.NAMES;
	public static readonly TYPES = ColorInstance.TYPES;
	public static readonly STEPS = ColorInstance.STEPS;
	public static readonly SCHEMES = ColorInstance.SCHEMES;

	public static get_category_from_name = <TName extends ColorName>(name: TName): ColorCategoryFromName<TName> => {
		// biome-ignore format: Prettier
		switch (name) {
			case "primary":
			case "secondary":
			case "accent": return "brand" as ColorCategoryFromName<TName>;
			case "error":
			case "info":
			case "success":
			case "warning": return "semantic" as ColorCategoryFromName<TName>;
			case "black":
			case "gray":
			case "white": return "grayscale" as ColorCategoryFromName<TName>;
			default: throw unrecognized(name);
		}
	};

	static #create_variant = <
		TCategory extends ColorCategory,
		TName extends ColorNameFromCategory<TCategory>,
		TType extends ColorType,
		TStep extends ColorStep,
	>(
		category: TCategory,
		name: TName,
		type: TType,
		step: TStep,
	): Variant<TCategory, TName, TType, TStep> =>
		`${category}-${name as TName extends ColorName ? TName : never}-${type}-${step}`;

	public static get = <
		TCategory extends ColorCategory,
		TName extends ColorNameFromCategory<TCategory>,
		TType extends ColorType = "solid",
		TStep extends ColorStep = 8,
	>(
		category: TCategory,
		name: TName,
		type = "solid" as TType,
		step = 8 as TStep,
	) => {
		const variant = this.#create_variant(category, name, type, step);
		const cached = DesignToken.CONSTRUCTED.get(`${Color.NAME}-${variant}`);
		if (cached) return cached as Color<TCategory, TName, TType, TStep>;
		return new Color({ category, name, type, step });
	};

	static #create_reference = <TTarget extends ColorTarget, TScheme extends ColorScheme>(
		target: TTarget,
		scheme: TScheme,
	) => {
		const reference = target.create_reference(scheme);
		reference.to_at_property({
			syntax: new Syntax("color"),
			inherits: true,
			initial_value: new Identifier("transparent").to_value(),
		});
		return reference;
	};

	static #create_oklch = <TTarget extends ColorTarget, TScheme extends ColorScheme>(
		target: TTarget,
		scheme: TScheme,
	): Value<[Oklch]> => {
		const target_reference = target.create_reference(scheme);
		return new Oklch({
			lightness: Lightness.from_reference(target_reference),
			chroma: Chroma.from_reference(target_reference),
			hue: Hue.from_reference(target_reference),
			alpha: Alpha.from_reference(target_reference),
		}).to_value();
	};

	public static class = <
		TTarget extends Target,
		TPseudoClass extends PseudoClassName | undefined = undefined,
		TPseudoElement extends PseudoElementName | undefined = undefined,
	>(
		target: TTarget,
		options: { pseudo_class?: TPseudoClass; pseudo_element?: TPseudoElement } = {},
	) => {
		const { pseudo_class, pseudo_element } = options;
		const color_target = new ColorTarget(target);
		// biome-ignore lint/style/useConst: It gets mutated conditionally
		let selector = Selector.class(color_target.toString());
		if (pseudo_class) selector.add_suffix(pseudo_class);
		if (pseudo_element) selector.add_suffix(pseudo_element);
		if (Color.RULESETS.has(selector.name)) return selector;
		const reference_light = Color.#create_reference(color_target, "light");
		const reference_dark = Color.#create_reference(color_target, "dark");
		const ruleset = new Ruleset(
			DesignToken.create_selector_joint(selector, options).to_list(),
			new Block(
				new Declaration(reference_light.to_property(), Color.#create_oklch(color_target, "light")),
				new Declaration(reference_dark.to_property(), Color.#create_oklch(color_target, "dark")),
				new Declaration(
					color_target.to_property(),
					new LightDark(reference_light.to_var(), reference_dark.to_var()).to_value(),
				),
			),
		);
		DesignToken.add_property_ruleset(selector, ruleset);
		return selector;
	};

	constructor(params: { category: TCategory; name: TName; type: TType; step: TStep }) {
		const { category, name, type, step } = params;
		super({
			name: Color.NAME,
			variant: Color.#create_variant(category, name, type, step),
			value: { category, name, type, step },
		});
	}

	public get light_dark() {
		const { value } = this;
		const { category, name, type, step } = value;
		return ColorInstance.get(category, name, type, step);
	}

	public set_target<TTarget extends Target>(target: TTarget): ColorTarget<TTarget> {
		return new ColorTarget(target);
	}

	#create_declaration<TTarget extends ColorTarget, TScheme extends ColorScheme, TProperty extends OklchPropertyName>(
		target: TTarget,
		scheme: TScheme,
		property: TProperty,
	) {
		const { reference } = this;
		return new Declaration(
			target.create_reference(`${scheme}-${property}`).to_property(),
			reference.add_suffix(scheme).add_suffix(property).to_var().to_value(),
		);
	}

	protected create_class_block<TTarget extends ColorTarget>(target: TTarget): Block {
		// biome-ignore lint/style/useConst: It gets mutated
		let block = new Block<Declaration[]>();
		for (const oklch_property_name of Oklch) {
			block.children.push(
				this.#create_declaration(target, "light", oklch_property_name),
				this.#create_declaration(target, "dark", oklch_property_name),
			);
		}
		return block;
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference } = this;
		const from_map = Color.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const { light_dark } = this;
		const { light, dark } = light_dark;
		const selector = Selector.pseudo.class("root");
		const block = new Block(
			// lightness
			new Declaration(reference.add_suffix("light-lightness").to_property(), light.lightness.to_value()),
			new Declaration(reference.add_suffix("dark-lightness").to_property(), dark.lightness.to_value()),
			// chroma
			new Declaration(reference.add_suffix("light-chroma").to_property(), light.chroma.to_value()),
			new Declaration(reference.add_suffix("dark-chroma").to_property(), dark.chroma.to_value()),
			// hue
			new Declaration(reference.add_suffix("light-hue").to_property(), light.hue.to_value()),
			new Declaration(reference.add_suffix("dark-hue").to_property(), dark.hue.to_value()),
			// alpha
			new Declaration(reference.add_suffix("light-alpha").to_property(), light.alpha.to_value()),
			new Declaration(reference.add_suffix("dark-alpha").to_property(), dark.alpha.to_value()),
		);
		const ruleset = new Ruleset(selector.to_list(), block);
		this.add_global_ruleset(ruleset);
		return ruleset;
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

type Target = ConstructorParameters<typeof ColorTarget>[0];

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(Color.name, () => {
		describe("static get(category, name, type?, step?)", () => {
			it("on constructed instance subscriber receive instance", ({ expect }) => {
				const observer = vi.fn((instance) => {
					expect(instance).toBeInstanceOf(Color);
				});
				Color.on("construct").subscribe({
					next: observer,
				});
				Color.get("semantic", "error");
				expect(observer).toHaveBeenCalled();
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const color = Color.get("brand", "accent");
				const global = color.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(
					`":root{--color-brand-accent-solid-8-light-lightness:74.5%;--color-brand-accent-solid-8-dark-lightness:54.06%;--color-brand-accent-solid-8-light-chroma:33.06%;--color-brand-accent-solid-8-dark-chroma:28.9%;--color-brand-accent-solid-8-light-hue:54.68deg;--color-brand-accent-solid-8-dark-hue:50.05deg;--color-brand-accent-solid-8-light-alpha:100%;--color-brand-accent-solid-8-dark-alpha:100%}"`,
				);
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("color-grayscale-gray-solid-8");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
				});
				Color.on("create-global-ruleset").subscribe({
					next: observer,
				});
				const color = Color.get("grayscale", "gray");
				color.create_global_ruleset();
				expect(observer).toHaveBeenCalled();
			});
		});

		describe("class_name(target?, options?)", () => {
			it("returns correctly when first argument target provided", ({ expect }) => {
				const color = Color.get("semantic", "success", "blend", 1);
				const class_name = color.class("border-block");
				const expected_name = "border-block-color-semantic-success-blend-1";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const color = Color.get("semantic", "warning");
				const class_name = color.class("caret", { pseudo_class: "hover" });
				const expected_name = "caret-color-semantic-warning-solid-8-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const color = Color.get("brand", "primary", "blend", 2);
				const class_name = color.class("border-right", { pseudo_element: "after" });
				const expected_name = "border-right-color-brand-primary-blend-2-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const color = Color.get("brand", "secondary", "solid", 6);
				const class_name = color.class("text-decoration", {
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "text-decoration-color-brand-secondary-solid-6-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in Color.RULESETS", ({ expect }) => {
				const color = Color.get("semantic", "info", "solid", 4);
				const class_name = color.class("accent");
				const ruleset = Color.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toMatchInlineSnapshot(
					`".accent-color-semantic-info-solid-4{--accent-color-light-lightness:var(--color-semantic-info-solid-4-light-lightness);--accent-color-dark-lightness:var(--color-semantic-info-solid-4-dark-lightness);--accent-color-light-chroma:var(--color-semantic-info-solid-4-light-chroma);--accent-color-dark-chroma:var(--color-semantic-info-solid-4-dark-chroma);--accent-color-light-hue:var(--color-semantic-info-solid-4-light-hue);--accent-color-dark-hue:var(--color-semantic-info-solid-4-dark-hue);--accent-color-light-alpha:var(--color-semantic-info-solid-4-light-alpha);--accent-color-dark-alpha:var(--color-semantic-info-solid-4-dark-alpha)}"`,
				);
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("outline-color-grayscale-black-blend-12");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
				});
				Color.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const color = Color.get("grayscale", "black", "blend", 12);
				color.class("outline");
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}
