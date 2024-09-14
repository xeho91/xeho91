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
import type { Value } from "@xeho91/lib-css/value";
import { unrecognized } from "@xeho91/lib-error/unrecognized";
import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import type { AtomicColor } from "#color/atomic";
import * as accent from "#color/palette/brand/accent";
import * as primary from "#color/palette/brand/primary";
import * as secondary from "#color/palette/brand/secondary";
import * as black from "#color/palette/grayscale/black";
import * as gray from "#color/palette/grayscale/gray";
import * as white from "#color/palette/grayscale/white";
import * as error from "#color/palette/semantic/error";
import * as info from "#color/palette/semantic/info";
import * as success from "#color/palette/semantic/success";
import * as warning from "#color/palette/semantic/warning";
import { DesignToken } from "#token";

const VARIABLE = readonly_object({
	brand: {
		accent,
		primary,
		secondary,
	},
	grayscale: {
		black,
		gray,
		white,
	},
	semantic: {
		error,
		info,
		success,
		warning,
	},
});

export type ColorBrandName = IterableElement<typeof ColorBrand.NAMES>;
// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative?
export class ColorBrand {
	public static readonly NAMES = readonly_set(object_keys(VARIABLE.brand));

	public static [Symbol.iterator](): IterableIterator<ColorBrandName> {
		return ColorBrand.NAMES[Symbol.iterator]();
	}
}

export type ColorGrayscaleName = IterableElement<typeof ColorGrayscale.NAMES>;
// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative?
export class ColorGrayscale {
	public static readonly NAMES = readonly_set(object_keys(VARIABLE.grayscale));

	public static [Symbol.iterator](): IterableIterator<ColorGrayscaleName> {
		return ColorGrayscale.NAMES[Symbol.iterator]();
	}
}

export type ColorSemanticName = IterableElement<typeof ColorSemantic.NAMES>;
// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative?
export class ColorSemantic {
	public static readonly NAMES = readonly_set(object_keys(VARIABLE.semantic));

	public static [Symbol.iterator](): IterableIterator<ColorSemanticName> {
		return ColorSemantic.NAMES[Symbol.iterator]();
	}
}

type Variant<
	TCategory extends ColorCategory = ColorCategory,
	TName extends ColorName = ColorName,
	TType extends ColorType = ColorType,
	TStep extends ColorStep = ColorStep,
> = `${TCategory}-${TName}-${TType}-${TStep}`;

export class Color<
	TCategory extends ColorCategory = ColorCategory,
	TName extends ColorName = ColorName,
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

	/**
	 * Supported color schemes set.
	 * @see {@link https://drafts.csswg.org/css-color-adjust/#color-scheme-prop}
	 */
	public static readonly SCHEMES = readonly_set(["light", "dark"]);

	/**
	 * Color steps set.
	 * **There are 12 steps in each scale**.
	 * Each step was designed for at least one specific use case.
	 * This table is a simple overview of the most common use case for each step.
	 *
	 * | Step | Use Case                                |
	 * | ---- | --------------------------------------- |
	 * | 1    | App background                          |
	 * | 2    | Subtle background                       |
	 * | 3    | UI element background                   |
	 * | 4    | Hovered UI element background           |
	 * | 5    | Active / Selected UI element background |
	 * | 6    | Subtle borders and separators           |
	 * | 7    | UI element border and focus rings       |
	 * | 8    | Hovered UI element border               |
	 * | 9    | Solid backgrounds                       |
	 * | 10   | Hovered solid backgrounds               |
	 * | 11   | Low-contrast text                       |
	 * | 12   | High-contrast text                      |
	 *
	 * @see {@link https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale#use-cases}
	 */
	public static readonly STEPS = readonly_set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

	/**
	 * Available color categories set, for grouping purposes.
	 */
	public static readonly CATEGORIES = readonly_set(object_keys(VARIABLE));

	/**
	 * The idea is that the solid and blend scales are interchangeable, since they match almost perfectly.
	 * Sometimes you need a color to be transparent, so it works well on coloured backgrounds for example.
	 * Sometimes you need opaque colors, sometimes transparent. Now you have the option.
	 *
	 * @see {@link https://github.com/radix-ui/colors/issues/9#issuecomment-876643069}
	 */
	public static readonly TYPES = readonly_set(["opaque", "blend"]);

	public static readonly NAMES = readonly_set([
		"primary",
		"secondary",
		"accent",
		"error",
		"info",
		"success",
		"warning",
		"black",
		"gray",
		"white",
	]);

	public static brand = ColorBrand;
	public static grayscale = ColorGrayscale;
	public static semantic = ColorSemantic;

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
		TName extends ColorName,
		TType extends ColorType,
		TStep extends ColorStep,
	>(
		category: TCategory,
		name: TName,
		type: TType,
		step: TStep,
	): Variant<TCategory, TName, TType, TStep> => `${category}-${name}-${type}-${step}`;

	public static get = <TName extends ColorName, TType extends ColorType = "opaque", TStep extends ColorStep = 8>(
		name: TName,
		type = "opaque" as TType,
		step = 8 as TStep,
	): Color<ColorCategoryFromName<TName>, TName, TType, TStep> => {
		const category = Color.get_category_from_name(name);
		const variant = this.#create_variant(category, name, type, step);
		const cached = DesignToken.CONSTRUCTED.get(`${Color.NAME}-${variant}`);
		// @ts-expect-error Not worth it to use assertion
		if (cached) return cached;
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

	static #variable_identifier = <
		TName extends ColorName,
		TType extends ColorType,
		TStep extends ColorStep,
		TScheme extends ColorScheme,
	>(
		name: TName,
		type: TType,
		step: TStep,
		scheme: TScheme,
	): VariableIdentifier<TName, TType, TStep, TScheme> =>
		`${name.toUpperCase()}_${type.toUpperCase() as Uppercase<TType>}_${step}_${scheme.toUpperCase()}` as VariableIdentifier<
			TName,
			TType,
			TStep,
			TScheme
		>;

	static #get_identifiers<TCategory extends ColorCategory, TName extends ColorName>(
		category: TCategory,
		name: TName,
	): IdentifiersByCategory<TCategory, TName> {
		const by_category = VARIABLE[category as keyof typeof VARIABLE];
		return by_category[name as keyof typeof by_category];
	}

	static #get_by_scheme = <
		TCategory extends ColorCategory,
		TName extends ColorName,
		TType extends ColorType,
		TStep extends ColorStep,
		TScheme extends ColorScheme,
	>(
		category: TCategory,
		name: TName,
		type: TType,
		step: TStep,
		scheme: TScheme,
	): AtomicColor<TCategory, TName, TType, TStep, TScheme> => {
		const by_category_and_name = Color.#get_identifiers(category, name as ColorName);
		return by_category_and_name[
			Color.#variable_identifier(name as ColorName, type, step, scheme) as keyof typeof by_category_and_name
		] as AtomicColor<TCategory, TName, TType, TStep, TScheme>;
	};

	constructor(params: { category: TCategory; name: TName; type: TType; step: TStep }) {
		const { category, name, type, step } = params;
		super({
			name: Color.NAME,
			variant: Color.#create_variant(category, name, type, step),
			value: { category, name, type, step },
		});
	}
	public get light() {
		const { value } = this;
		const { category, name, type, step } = value;
		return Color.#get_by_scheme(category, name, type, step, "light");
	}

	public get dark() {
		const { value } = this;
		const { category, name, type, step } = value;
		return Color.#get_by_scheme(category, name, type, step, "dark");
	}

	public set_target<TTarget extends Target>(target: TTarget): ColorTarget<TTarget> {
		return new ColorTarget(target);
	}

	#create_declaration<TTarget extends ColorTarget, TScheme extends ColorScheme, TProperty extends OklchPropertyName>(
		target: TTarget,
		scheme: TScheme,
		property: TProperty,
	): Declaration {
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
		const { light, dark } = this;
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

/**
 * @see {@link Color.CATEGORIES}
 */
export type ColorCategory = IterableElement<typeof Color.CATEGORIES>;

/**
 * @see {@link Color.NAMES}
 */
export type ColorName = IterableElement<typeof Color.NAMES>;

/**
 * @see {@link Color.SCHEMES}
 */
export type ColorScheme = IterableElement<typeof Color.SCHEMES>;

/**
 * @see {@link Color.TYPES}
 */
export type ColorType = IterableElement<typeof Color.TYPES>;

/**
 * @see {@link Color.STEPS}
 */
export type ColorStep = IterableElement<typeof Color.STEPS>;

type VariableIdentifier<
	TName extends ColorName,
	TType extends ColorType,
	TStep extends ColorStep,
	TScheme extends ColorScheme,
> = `${Uppercase<TName>}_${Uppercase<TType>}_${TStep}_${Uppercase<TScheme>}`;

type IdentifiersByCategory<
	TCategory extends ColorCategory,
	TName extends ColorName,
> = TName extends keyof (typeof VARIABLE)[TCategory] ? (typeof VARIABLE)[TCategory][TName] : never;

export type ColorCategoryFromName<TName extends ColorName> = TName extends "primary" | "secondary" | "accent"
	? "brand"
	: TName extends "error" | "info" | "success" | "warning"
		? "semantic"
		: TName extends "black" | "gray" | "white"
			? "grayscale"
			: never;

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
				Color.get("error");
				expect(observer).toHaveBeenCalled();
			});
		});

		describe("static class(target, options?)", () => {
			it("on call subscriber receive [selector, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("background-color");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`".background-color{--background-color-light:oklch(var(--background-color-light-lightness) var(--background-color-light-chroma) var(--background-color-light-hue) / var(--background-color-light-alpha));--background-color-dark:oklch(var(--background-color-dark-lightness) var(--background-color-dark-chroma) var(--background-color-dark-hue) / var(--background-color-dark-alpha));background-color:light-dark(var(--background-color-light) , var(--background-color-dark));}"`,
					);
				});
				Color.on("create-property-ruleset").subscribe({
					next: observer,
				});
				Color.class("background");
				Color.class("background");
				expect(observer).toHaveBeenCalledOnce();
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const color = Color.get("accent");
				const global = color.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(
					`":root{--color-brand-accent-opaque-8-light-lightness:74.5%;--color-brand-accent-opaque-8-dark-lightness:54.06%;--color-brand-accent-opaque-8-light-chroma:33.06%;--color-brand-accent-opaque-8-dark-chroma:28.9%;--color-brand-accent-opaque-8-light-hue:54.68deg;--color-brand-accent-opaque-8-dark-hue:50.05deg;--color-brand-accent-opaque-8-light-alpha:100%;--color-brand-accent-opaque-8-dark-alpha:100%;}"`,
				);
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("color-grayscale-gray-opaque-8");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`":root{--color-grayscale-gray-opaque-8-light-lightness:79.11%;--color-grayscale-gray-opaque-8-dark-lightness:48.93%;--color-grayscale-gray-opaque-8-light-chroma:2.11%;--color-grayscale-gray-opaque-8-dark-chroma:2.06%;--color-grayscale-gray-opaque-8-light-hue:98.91deg;--color-grayscale-gray-opaque-8-dark-hue:88.7deg;--color-grayscale-gray-opaque-8-light-alpha:100%;--color-grayscale-gray-opaque-8-dark-alpha:100%;}"`,
					);
				});
				Color.on("create-global-ruleset").subscribe({
					next: observer,
				});
				const color = Color.get("gray");
				color.create_global_ruleset();
				expect(observer).toHaveBeenCalled();
			});
		});

		describe("class(target, options?)", () => {
			it("returns correctly when first argument target provided", ({ expect }) => {
				const color = Color.get("success", "blend", 1);
				const class_name = color.class("border-block");
				const expected_name = "border-block-color-semantic-success-blend-1";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const color = Color.get("warning");
				const class_name = color.class("caret", { pseudo_class: "hover" });
				const expected_name = "caret-color-semantic-warning-opaque-8-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const color = Color.get("primary", "blend", 2);
				const class_name = color.class("border-right", { pseudo_element: "after" });
				const expected_name = "border-right-color-brand-primary-blend-2-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const color = Color.get("secondary", "opaque", 6);
				const class_name = color.class("text-decoration", {
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "text-decoration-color-brand-secondary-opaque-6-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in Color.RULESETS", ({ expect }) => {
				const color = Color.get("info", "opaque", 4);
				const class_name = color.class("accent");
				const ruleset = Color.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toMatchInlineSnapshot(
					`".accent-color-semantic-info-opaque-4{--accent-color-light-lightness:var(--color-semantic-info-opaque-4-light-lightness);--accent-color-dark-lightness:var(--color-semantic-info-opaque-4-dark-lightness);--accent-color-light-chroma:var(--color-semantic-info-opaque-4-light-chroma);--accent-color-dark-chroma:var(--color-semantic-info-opaque-4-dark-chroma);--accent-color-light-hue:var(--color-semantic-info-opaque-4-light-hue);--accent-color-dark-hue:var(--color-semantic-info-opaque-4-dark-hue);--accent-color-light-alpha:var(--color-semantic-info-opaque-4-light-alpha);--accent-color-dark-alpha:var(--color-semantic-info-opaque-4-dark-alpha);}"`,
				);
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("outline-color-grayscale-black-blend-12");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`".outline-color-grayscale-black-blend-12{--outline-color-light-lightness:var(--color-grayscale-black-blend-12-light-lightness);--outline-color-dark-lightness:var(--color-grayscale-black-blend-12-dark-lightness);--outline-color-light-chroma:var(--color-grayscale-black-blend-12-light-chroma);--outline-color-dark-chroma:var(--color-grayscale-black-blend-12-dark-chroma);--outline-color-light-hue:var(--color-grayscale-black-blend-12-light-hue);--outline-color-dark-hue:var(--color-grayscale-black-blend-12-dark-hue);--outline-color-light-alpha:var(--color-grayscale-black-blend-12-light-alpha);--outline-color-dark-alpha:var(--color-grayscale-black-blend-12-dark-alpha);}"`,
					);
				});
				Color.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const color = Color.get("black", "blend", 12);
				color.class("outline");
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}
