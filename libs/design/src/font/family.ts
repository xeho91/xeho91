import { Block } from "@xeho91/lib-css/block";
import { Declaration } from "@xeho91/lib-css/declaration";
import { Property } from "@xeho91/lib-css/property";
import { Ruleset } from "@xeho91/lib-css/ruleset";
import { Selector } from "@xeho91/lib-css/selector";
import { SelectorClass } from "@xeho91/lib-css/selector/class";
import type { PseudoClassName } from "@xeho91/lib-css/selector/pseudo-class";
import type { PseudoElementName } from "@xeho91/lib-css/selector/pseudo-element";
import type { InferValue } from "@xeho91/lib-css/value";
import { StringCSS } from "@xeho91/lib-css/value/string";
import { unrecognized } from "@xeho91/lib-error/unrecognized";
import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import {
	type FontWeightKey,
	FontWeightMono,
	type FontWeightMonoKey,
	FontWeightSans,
	type FontWeightSansKey,
	FontWeightSerif,
	type FontWeightSerifKey,
} from "#font/weight";
import { DesignToken } from "#token";

export type FontFamilyName = IterableElement<typeof FontFamily.NAMES>;

// TODO: Add font fallbacks

/**
 * Design token keys for the font family.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-family}
 */
export class FontFamily<
	TName extends FontFamilyName = FontFamilyName,
	TValue extends string = string,
> extends DesignToken<"font", TName, StringCSS<TValue>> {
	public static readonly PROPERTY = new Property("font-family");

	public static readonly VALUE = readonly_object({
		mono: "Jetbrains Mono",
		sans: "Work Sans",
		serif: "Fraunces",
	});

	/**
	 * Available design token keys for the font family.
	 */
	public static readonly NAMES = readonly_set(object_keys(FontFamily.VALUE));

	public static [Symbol.iterator](): IterableIterator<FontFamilyName> {
		return FontFamily.NAMES[Symbol.iterator]();
	}

	/**
	 * Default design token key for the font family.
	 */
	public static readonly DEFAULT = "sans" satisfies FontFamilyName;

	public static default = () => FontFamily.get(FontFamily.DEFAULT);

	public static get = <TName extends FontFamilyName>(
		name: TName,
	): FontFamily<TName, (typeof FontFamily.VALUE)[TName]> => {
		const cached = FontFamily.CONSTRUCTED.get(name);
		if (cached) return cached as FontFamily<TName, (typeof FontFamily.VALUE)[TName]>;
		return new FontFamily(name, FontFamily.VALUE[name]);
	};

	private constructor(key: TName, value: TValue) {
		super({
			name: "font",
			variant: key,
			value: new StringCSS(value),
		});
	}

	public set_target(): typeof FontFamily.PROPERTY {
		return FontFamily.PROPERTY;
	}

	protected create_class_declaration(): Declaration<typeof FontFamily.PROPERTY, InferValue<FontFamily["var"]>> {
		const { var: var_ } = this;
		return new Declaration(FontFamily.PROPERTY, var_.to_value());
	}

	protected create_class_block(): Block<[ReturnType<FontFamily["create_class_declaration"]>]> {
		return new Block(this.create_class_declaration());
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference, value } = this;
		const from_map = FontFamily.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const declaration = new Declaration(reference.to_property(), value.to_value());
		const ruleset = new Ruleset(selector.to_list(), declaration.to_block());
		this.add_global_ruleset(ruleset);
		return ruleset;
	}

	public class<
		TPseudoClass extends PseudoClassName | undefined = undefined,
		PseudoElement extends PseudoElementName | undefined = undefined,
	>(options: { pseudo_class?: TPseudoClass; pseudo_element?: PseudoElement } = {}) {
		return this.create_selector_class({
			...options,
			target: this.set_target(),
		});
	}

	public weight<TWeight extends FontWeightKey<TName>>(key: TWeight): GetFontWeight<TName, TWeight> {
		const { variant } = this;
		// biome-ignore format: Prettier
		switch (variant) {
			case "mono": return FontWeightMono.get(key as FontWeightMonoKey) as GetFontWeight<TName, TWeight>;
			case "sans": return FontWeightSans.get(key as FontWeightSansKey) as GetFontWeight<TName, TWeight>;
			case "serif": return FontWeightSerif.get(key as FontWeightSerifKey) as GetFontWeight<TName, TWeight>;
			default: throw unrecognized(variant);
		}
	}
}

type GetFontWeight<TName extends FontFamilyName, TWeight extends FontWeightKey<TName>> = TName extends "mono"
	? ReturnType<typeof FontWeightMono.get<TWeight extends FontWeightMonoKey ? TWeight : never>>
	: TName extends "sans"
		? ReturnType<typeof FontWeightSans.get<TWeight extends FontWeightSansKey ? TWeight : never>>
		: TName extends "serif"
			? ReturnType<typeof FontWeightSerif.get<TWeight extends FontWeightSerifKey ? TWeight : never>>
			: never;

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(FontFamily.name, () => {
		describe("static [Symbol.iterator]", () => {
			it("iterates through available keys", ({ expect }) => {
				for (const name of FontFamily) {
					expect(FontFamily.NAMES.has(name)).toBe(true);
					expectTypeOf(name).toEqualTypeOf<FontFamilyName>();
				}
			});
		});

		describe("static get(name)", () => {
			it("returns default when no name provided", ({ expect }) => {
				const font_family = FontFamily.default();
				expect(font_family).toBeInstanceOf(FontFamily);
				expectTypeOf(font_family).toMatchTypeOf<FontFamily<typeof FontFamily.DEFAULT, "Work Sans">>();
			});

			it("on constructed instance subscriber receive instance", ({ expect }) => {
				const observer = vi.fn((instance) => {
					expect(instance).toBeInstanceOf(FontFamily);
				});
				FontFamily.on("construct").subscribe({
					next: observer,
				});
				FontFamily.get("mono");
				expect(observer).toHaveBeenCalled();
			});

			it("returns a FontFamily instance for each key", ({ expect }) => {
				for (const name of FontFamily) {
					const instance = FontFamily.get(name);
					expect(instance).toBeInstanceOf(FontFamily);
					expectTypeOf(instance).toMatchTypeOf<FontFamily<FontFamilyName, string>>();
				}
				expectTypeOf(FontFamily.get("mono")).toEqualTypeOf<FontFamily<"mono", "Jetbrains Mono">>();
				expectTypeOf(FontFamily.get("sans")).toEqualTypeOf<FontFamily<"sans", "Work Sans">>();
				expectTypeOf(FontFamily.get("serif")).toEqualTypeOf<FontFamily<"serif", "Fraunces">>();
			});

			it("it got cached in the CONSTRUCTED", ({ expect }) => {
				for (const family of FontFamily) {
					expect(FontFamily.CONSTRUCTED.has(`font-${family}`)).toBe(true);
				}
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const font_family = FontFamily.default();
				const global = font_family.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(`":root{--font-sans:"Work Sans"}"`);
			});

			it("created rulesets in FontFamily.GLOBAL_RULESETS", ({ expect }) => {
				for (const name of FontFamily) {
					const font_family = FontFamily.get(name);
					font_family.create_global_ruleset();
					expect(FontFamily.GLOBAL_RULESETS.has(name)).toBe(true);
				}
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("font-mono");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
				});
				FontFamily.on("create-global-ruleset").subscribe({
					next: observer,
				});
				const space = FontFamily.get("mono");
				space.create_global_ruleset();
				expect(observer).toHaveBeenCalled();
			});
		});

		describe("class_name(options?)", () => {
			it("returns correctly when no arguments provided", ({ expect }) => {
				const font_family = FontFamily.default();
				const class_name = font_family.class();
				const expected_stringified = "font-sans";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_stringified);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_stringified>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const font_family = FontFamily.default();
				const class_name = font_family.class({ pseudo_class: "hover" });
				const expected_name = "font-sans-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const font_family = FontFamily.default();
				const selector = font_family.class({ pseudo_element: "after" });
				const expected_name = "font-sans-after";
				expect(selector).toBeInstanceOf(SelectorClass);
				expect(selector.name).toBe(expected_name);
				expectTypeOf(selector).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const font_family = FontFamily.default();
				const class_name = font_family.class({ pseudo_class: "checked", pseudo_element: "before" });
				const expected_name = "font-sans-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in FontFamily.RULESETS", ({ expect }) => {
				const font_family = FontFamily.default();
				const class_name = font_family.class();
				const ruleset = FontFamily.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toBe(".font-sans{font-family:var(--font-sans)}");
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("font-serif");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
				});
				FontFamily.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const space = FontFamily.get("serif");
				space.class();
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}
