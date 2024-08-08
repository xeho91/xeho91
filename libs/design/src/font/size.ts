import { Block } from "@xeho91/lib-css/block";
import { Declaration } from "@xeho91/lib-css/declaration";
import { Identifier } from "@xeho91/lib-css/identifier";
import { Property } from "@xeho91/lib-css/property";
import { Ruleset } from "@xeho91/lib-css/ruleset";
import { Selector } from "@xeho91/lib-css/selector";
import { SelectorClass } from "@xeho91/lib-css/selector/class";
import type { PseudoClassName } from "@xeho91/lib-css/selector/pseudo-class";
import type { PseudoElementName } from "@xeho91/lib-css/selector/pseudo-element";
import type { InferValue } from "@xeho91/lib-css/value";
import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import { Range } from "@xeho91/lib-struct/range";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import { calculateClamp } from "utopia-core";

import { FLUID_CONFIG, type FluidClamp } from "#fluid";
import { DesignToken } from "#token";

export type FontSizeKey = IterableElement<typeof FontSize.KEYS>;

/**
 * Design token keys for the font size.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-size}
 */
export class FontSize<TRawKey extends FontSizeKey = FontSizeKey, TValue extends Range = Range> extends DesignToken<
	typeof FontSize.NAME,
	TRawKey,
	TValue
> {
	public static readonly NAME = "font-size" as const;
	public static readonly PROPERTY = new Property(FontSize.NAME);

	public static readonly VALUE = readonly_object({
		"5xl": new Range(53.75, 76.29),
		"4xl": new Range(44.79, 61.04),
		"3xl": new Range(37.32, 48.83),
		"2xl": new Range(31.1, 39.06),
		xl: new Range(25.92, 31.25),
		l: new Range(21.6, 25.0),
		m: new Range(18.0, 20.0),
		s: new Range(15.0, 16.0),
	});

	/**
	 * Available design token keys for the font size.
	 */
	public static readonly KEYS = readonly_set(object_keys(FontSize.VALUE));

	public static [Symbol.iterator](): IterableIterator<FontSizeKey> {
		return FontSize.KEYS[Symbol.iterator]();
	}

	/**
	 * Get default design token key for the font size.
	 */
	public static readonly DEFAULT = "m" satisfies FontSizeKey;

	public static default = () => FontSize.get(FontSize.DEFAULT);

	public static get = <TKey extends FontSizeKey>(key: TKey): FontSize<TKey, (typeof FontSize.VALUE)[TKey]> => {
		const cached = FontSize.CONSTRUCTED.get(key);
		if (cached) return cached as FontSize<TKey, (typeof FontSize.VALUE)[TKey]>;
		return new FontSize(key, FontSize.VALUE[key]);
	};

	private constructor(key: TRawKey, value: TValue) {
		super({
			name: FontSize.NAME,
			variant: key,
			value,
		});
	}

	/**
	 * Get the CSS clamp function for calculating the value of this font size token.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/clamp}
	 */
	private get clamp(): Identifier<FluidClamp> {
		return new Identifier(
			calculateClamp({
				...FLUID_CONFIG,
				minSize: this.value.min,
				maxSize: this.value.max,
			}) as FluidClamp,
		);
	}

	public set_target(): typeof FontSize.PROPERTY {
		return FontSize.PROPERTY;
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference, clamp } = this;
		const from_map = FontSize.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const declaration = new Declaration(reference.to_property(), clamp.to_value());
		const ruleset = new Ruleset(selector.to_list(), declaration.to_block());
		this.add_global_ruleset(ruleset);
		return ruleset;
	}

	protected create_class_declaration(): Declaration<typeof FontSize.PROPERTY, InferValue<FontSize["var"]>> {
		const { var: var_ } = this;
		return new Declaration(FontSize.PROPERTY, var_.to_value());
	}

	protected create_class_block(): Block<[ReturnType<FontSize["create_class_declaration"]>]> {
		return new Block(this.create_class_declaration());
	}

	public class<
		TPseudoClass extends PseudoClassName | undefined = undefined,
		TPseudoElement extends PseudoElementName | undefined = undefined,
	>(options: { pseudo_class?: TPseudoClass; pseudo_element?: TPseudoElement } = {}) {
		return this.create_selector_class({
			...options,
			target: this.set_target(),
		});
	}
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(FontSize.name, () => {
		describe("static [Symbol.iterator]", () => {
			it("iterates through available keys", ({ expect }) => {
				for (const key of FontSize) {
					expect(FontSize.KEYS.has(key)).toBe(true);
					expectTypeOf(key).toEqualTypeOf<FontSizeKey>();
				}
			});
		});

		describe("static size(name?)", () => {
			it("returns default when no name provided", ({ expect }) => {
				const key = FontSize.default();
				expect(key).toBeInstanceOf(FontSize);
				expectTypeOf(key).toEqualTypeOf<FontSize<typeof FontSize.DEFAULT, Range<18, 20>>>();
				expect(key.value).toBeInstanceOf(Range);
				expect(key.value.min).toBe(18);
				expect(key.value.max).toBe(20);
				expectTypeOf(key.value).toEqualTypeOf<Range<18, 20>>();
			});

			it("on constructed instance subscriber receive instance", ({ expect }) => {
				const subscriber = vi.fn((instance) => {
					expect(instance).toBeInstanceOf(FontSize);
				});
				FontSize.on("construct").subscribe({
					next: subscriber,
				});
				FontSize.get("xl");
				expect(subscriber).toHaveBeenCalled();
			});

			it("returns a FontSize instance for each key", ({ expect }) => {
				for (const key of FontSize) {
					const instance = FontSize.get(key);
					expect(instance).toBeInstanceOf(FontSize);
					expectTypeOf(instance).toMatchTypeOf<FontSize<FontSizeKey, Range>>();
				}
				expectTypeOf(FontSize.get("s")).toMatchTypeOf<FontSize<"s", Range>>();
				expectTypeOf(FontSize.get("m")).toMatchTypeOf<FontSize<"m", Range>>();
				expectTypeOf(FontSize.get("l")).toMatchTypeOf<FontSize<"l", Range>>();
				expectTypeOf(FontSize.get("xl")).toMatchTypeOf<FontSize<"xl", Range>>();
				expectTypeOf(FontSize.get("2xl")).toMatchTypeOf<FontSize<"2xl", Range>>();
				expectTypeOf(FontSize.get("3xl")).toMatchTypeOf<FontSize<"3xl", Range>>();
			});

			it("it got cached in the CONSTRUCTED", ({ expect }) => {
				for (const key of FontSize) {
					expect(FontSize.CONSTRUCTED.has(`font-size-${key}`)).toBe(true);
				}
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const font_size = FontSize.default();
				const global = font_size.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(
					`":root{--font-size-m:clamp(1.125rem, 1.0797rem + 0.2198cqi, 1.25rem)}"`,
				);
			});

			it("created rulesets in FontSize.GLOBAL_RULESETS", ({ expect }) => {
				for (const key of FontSize) {
					const font_size = FontSize.get(key);
					font_size.create_global_ruleset();
					expect(FontSize.GLOBAL_RULESETS.has(key)).toBe(true);
				}
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const subscriber = vi.fn((tuple) => {
					expect(tuple[0]).toBe("font-size-l");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
				});
				FontSize.on("create-global-ruleset").subscribe({
					next: subscriber,
				});
				const space = FontSize.get("l");
				space.create_global_ruleset();
				expect(subscriber).toHaveBeenCalled();
			});
		});

		describe("class_name(options?)", () => {
			it("returns correctly when first argument target provided", ({ expect }) => {
				const font_size = FontSize.default();
				const class_name = font_size.class();
				const expected_name = "font-size-m";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const font_size = FontSize.default();
				const class_name = font_size.class({ pseudo_class: "hover" });
				const expected_name = "font-size-m-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const font_size = FontSize.default();
				const class_name = font_size.class({ pseudo_element: "after" });
				const expected_name = "font-size-m-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const font_size = FontSize.default();
				const class_name = font_size.class({
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "font-size-m-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in FontSize.RULESETS", ({ expect }) => {
				const font_size = FontSize.default();
				const class_name = font_size.class();
				const ruleset = FontSize.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toBe(".font-size-m{font-size:var(--font-size-m)}");
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("font-size-l");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
				});
				FontSize.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const font_size = FontSize.get("l");
				font_size.class();
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}
