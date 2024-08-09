import { Block } from "@xeho91/lib-css/block";
import { Declaration } from "@xeho91/lib-css/declaration";
import { Property } from "@xeho91/lib-css/property";
import { Ruleset } from "@xeho91/lib-css/ruleset";
import { Selector } from "@xeho91/lib-css/selector";
import { SelectorClass } from "@xeho91/lib-css/selector/class";
import type { PseudoClassName } from "@xeho91/lib-css/selector/pseudo-class";
import type { PseudoElementName } from "@xeho91/lib-css/selector/pseudo-element";
import type { InferValue } from "@xeho91/lib-css/value";
import { NumberCSS } from "@xeho91/lib-css/value/number";
import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import type { FontFamilyName } from "#font/family";
import { DesignToken } from "#token";

export type FontWeightKey<TFamily extends FontFamilyName> = TFamily extends "mono"
	? FontWeightMonoKey
	: TFamily extends "sans"
		? FontWeightSansKey
		: TFamily extends "serif"
			? FontWeightSerifKey
			: never;

/**
 * Design token keys for the font weight.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight}
 */
export class FontWeight<
	TFamily extends FontFamilyName = FontFamilyName,
	TRawKey extends string = string,
	TValue extends NumberCSS = NumberCSS,
> extends DesignToken<typeof FontWeight.NAME, TRawKey, TValue> {
	public static readonly NAME = "font-weight";
	public static readonly PROPERTY = new Property(FontWeight.NAME);

	public static keys = <TFamily extends FontFamilyName>(family: TFamily) => {
		// biome-ignore format: Prettier
		switch (family) {
			case "mono": return FontWeightMono.KEYS;
			case "sans": return FontWeightSans.KEYS;
			case "serif": return FontWeightSerif.KEYS;
		}
	};

	public static get mono() {
		return FontWeightMono;
	}

	public static get sans() {
		return FontWeightSans;
	}

	public static get serif() {
		return FontWeightSerif;
	}

	// public static mono = <TKey extends FontWeightMonoKey>(
	// 	key: TKey,
	// ): FontWeightMono<TKey, (typeof FontWeightMono.VALUE)[TKey]> => FontWeightMono.get(key);
	//
	// public static sans = <TKey extends FontWeightSansKey>(
	// 	key: TKey,
	// ): FontWeightSans<TKey, (typeof FontWeightSans.VALUE)[TKey]> => FontWeightSans.get(key);
	//
	// public static serif = <TKey extends FontWeightSerifKey>(
	// 	key: TKey,
	// ): FontWeightSerif<TKey, (typeof FontWeightSerif.VALUE)[TKey]> => FontWeightSerif.get(key);

	public readonly family: TFamily;

	protected constructor(data: { family: TFamily; raw_key: TRawKey; value: TValue }) {
		const { family, raw_key, value } = data;
		super({
			name: FontWeight.NAME,
			variant: raw_key,
			value,
		});
		this.family = family;
	}

	public set_target(): typeof FontWeight.PROPERTY {
		return FontWeight.PROPERTY;
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference, value } = this;
		const from_map = FontWeight.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const declaration = new Declaration(reference.to_property(), value.to_value());
		const ruleset = new Ruleset(selector.to_list(), declaration.to_block());
		this.add_global_ruleset(ruleset);
		return ruleset;
	}

	protected create_class_declaration(): Declaration<typeof FontWeight.PROPERTY, InferValue<FontWeight["var"]>> {
		const { var: var_ } = this;
		return new Declaration(FontWeight.PROPERTY, var_.to_value() as InferValue<FontWeight["var"]>);
	}

	protected create_class_block(): Block<[ReturnType<FontWeight["create_class_declaration"]>]> {
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

export type FontWeightMonoKey = IterableElement<typeof FontWeightMono.KEYS>;

export class FontWeightMono<
	TWeight extends FontWeightMonoKey = FontWeightMonoKey,
	TValue extends NumberCSS = NumberCSS,
> extends FontWeight<"mono", WeightWithFamily<"mono", TWeight>, TValue> {
	public static readonly VALUE = readonly_object({
		regular: new NumberCSS(400),
		bold: new NumberCSS(700),
	});

	public static readonly KEYS = readonly_set(object_keys(FontWeightMono.VALUE));

	public static [Symbol.iterator](): IterableIterator<FontWeightMonoKey> {
		return FontWeightMono.KEYS[Symbol.iterator]();
	}

	public static readonly DEFAULT = "regular" satisfies FontWeightMonoKey;

	public static get = <TWeight extends FontWeightMonoKey>(key: TWeight) =>
		new FontWeightMono(key, FontWeightMono.VALUE[key]);

	public static default = () => FontWeightMono.get(FontWeightMono.DEFAULT);

	private constructor(key: TWeight, value: TValue) {
		super({ family: "mono", raw_key: `mono-${key}`, value });
	}
}

export type FontWeightSansKey = IterableElement<typeof FontWeightSans.KEYS>;

export class FontWeightSans<
	TWeight extends FontWeightSansKey = FontWeightSansKey,
	TValue extends NumberCSS = NumberCSS,
> extends FontWeight<"sans", WeightWithFamily<"sans", TWeight>, TValue> {
	public static readonly VALUE = readonly_object({
		light: new NumberCSS(300),
		medium: new NumberCSS(500),
		bold: new NumberCSS(700),
		black: new NumberCSS(900),
	});

	public static readonly KEYS = readonly_set(object_keys(FontWeightSans.VALUE));

	public static [Symbol.iterator](): IterableIterator<FontWeightSansKey> {
		return FontWeightSans.KEYS[Symbol.iterator]();
	}

	public static readonly DEFAULT = "light" satisfies FontWeightSansKey;

	public static get = <TWeight extends FontWeightSansKey>(key: TWeight) =>
		new FontWeightSans(key, FontWeightSans.VALUE[key]);

	public static default = () => FontWeightSans.get(FontWeightSans.DEFAULT);

	private constructor(key: TWeight, value: TValue) {
		super({ family: "sans", raw_key: `sans-${key}`, value });
	}
}

export type FontWeightSerifKey = IterableElement<typeof FontWeightSerif.KEYS>;

export class FontWeightSerif<
	TWeight extends FontWeightSerifKey = FontWeightSerifKey,
	TValue extends NumberCSS = NumberCSS,
> extends FontWeight<"serif", WeightWithFamily<"serif", TWeight>, TValue> {
	public static readonly VALUE = readonly_object({
		light: new NumberCSS(300),
		medium: new NumberCSS(500),
		bold: new NumberCSS(700),
		black: new NumberCSS(900),
	});

	public static readonly KEYS = readonly_set(object_keys(FontWeightSerif.VALUE));

	public static [Symbol.iterator](): IterableIterator<FontWeightSerifKey> {
		return FontWeightSerif.KEYS[Symbol.iterator]();
	}

	public static readonly DEFAULT = "light" satisfies FontWeightSerifKey;

	public static get = <TWeight extends FontWeightSerifKey>(key: TWeight) =>
		new FontWeightSerif(key, FontWeightSerif.VALUE[key]);

	public static default = () => FontWeightSerif.get(FontWeightSerif.DEFAULT);

	private constructor(key: TWeight, value: TValue) {
		super({ family: "serif", raw_key: `serif-${key}`, value });
	}
}

type WeightWithFamily<TFamily extends FontFamilyName, TWeight extends string> = `${TFamily}-${TWeight}`;

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(FontWeight.name, () => {
		describe("static get(family, key?)", () => {
			it("returns default when no name provided", ({ expect }) => {
				const key = FontWeight.mono.default();
				expect(key).toBeInstanceOf(FontWeight);
				expectTypeOf(key).toEqualTypeOf<FontWeightMono<"regular", NumberCSS<400>>>();
			});

			it("on constructed instance subscriber receive instance", ({ expect }) => {
				const subscriber = vi.fn((instance) => {
					expect(instance).toBeInstanceOf(FontWeight);
				});
				FontWeight.on("construct").subscribe({
					next: subscriber,
				});
				FontWeight.serif.default();
				expect(subscriber).toHaveBeenCalled();
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const font_weight = FontWeight.sans.default();
				const global = font_weight.create_global_ruleset();
				const stringified = global.toString();
				const expected_stringified = ":root{--font-weight-sans-light:300}";
				expect(stringified).toBe(expected_stringified);
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const subscriber = vi.fn((tuple) => {
					expect(tuple[0]).toBe("sans-light");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot();
				});
				FontWeight.on("create-global-ruleset").subscribe({
					next: subscriber,
				});
				const space = FontWeight.sans.get("light");
				space.create_global_ruleset();
				expect(subscriber).toHaveBeenCalled();
			});
		});

		describe("class_name(options?)", () => {
			it("returns correctly when first argument target provided", ({ expect }) => {
				const font_weight = FontWeightMono.default();
				const class_name = font_weight.class();
				const expected_name = "font-weight-mono-regular";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const font_weight = FontWeight.mono.default();
				const class_name = font_weight.class({ pseudo_class: "hover" });
				const expected_name = "font-weight-mono-regular-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const font_weight = FontWeight.mono.default();
				const class_name = font_weight.class({ pseudo_element: "after" });
				const expected_name = "font-weight-mono-regular-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const font_weight = FontWeight.mono.get("bold");
				const class_name = font_weight.class({
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "font-weight-mono-bold-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in FontWeight.RULESETS", ({ expect }) => {
				const font_weight = FontWeight.mono.default();
				const class_name = font_weight.class();
				const ruleset = FontWeight.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toBe(
					".font-weight-mono-regular{font-weight:var(--font-weight-mono-regular)}",
				);
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("font-weight-mono-bold");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`".font-weight-mono-bold{font-weight:var(--font-weight-mono-bold)}"`,
					);
				});
				FontWeight.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const font_weight = FontWeight.mono.get("bold");
				font_weight.class();
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}
