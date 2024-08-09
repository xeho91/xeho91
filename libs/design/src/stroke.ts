import { Block } from "@xeho91/lib-css/block";
import { Declaration } from "@xeho91/lib-css/declaration";
import type { InferProperty } from "@xeho91/lib-css/property";
import { Ruleset } from "@xeho91/lib-css/ruleset";
import { Selector } from "@xeho91/lib-css/selector";
import { SelectorClass } from "@xeho91/lib-css/selector/class";
import type { PseudoClassName } from "@xeho91/lib-css/selector/pseudo-class";
import type { PseudoElementName } from "@xeho91/lib-css/selector/pseudo-element";
import { StrokeTarget } from "@xeho91/lib-css/target/stroke";
import type { InferValue } from "@xeho91/lib-css/value";
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { DesignToken } from "#token";

export type StrokeSize = IterableElement<typeof Stroke.SIZES>;

/**
 * Design token for the border radius / SVG stroke.
 */
export class Stroke<TSize extends StrokeSize = StrokeSize, TValue extends Dimension = Dimension> extends DesignToken<
	typeof Stroke.NAME,
	TSize,
	TValue
> {
	public static readonly NAME = "stroke";

	public static readonly VALUE = readonly_object({
		xs: new Dimension(1, "px"),
		s: new Dimension(2, "px"),
		m: new Dimension(4, "px"),
		l: new Dimension(8, "px"),
		xl: new Dimension(12, "px"),
	});

	/**
	 * Available design token keys for the radius.
	 */
	public static readonly SIZES = readonly_set(object_keys(Stroke.VALUE));

	public static [Symbol.iterator](): IterableIterator<StrokeSize> {
		return Stroke.SIZES[Symbol.iterator]();
	}

	/**
	 * Default design token key for the radius.
	 */
	public static readonly DEFAULT = "xs" satisfies StrokeSize;

	public static default = () => Stroke.get(Stroke.DEFAULT);

	public static get = <TSize extends StrokeSize>(size: TSize): Stroke<TSize, (typeof Stroke.VALUE)[TSize]> => {
		const cached = DesignToken.CONSTRUCTED.get(`${Stroke.NAME}-${size}`);
		if (cached) return cached as Stroke<TSize, (typeof Stroke.VALUE)[TSize]>;
		return new Stroke(size, Stroke.VALUE[size]);
	};

	private constructor(raw_key: TSize, value: TValue) {
		super({ name: Stroke.NAME, variant: raw_key, value });
	}

	protected create_class_declaration<TTarget extends StrokeTarget>(
		target: TTarget,
	): Declaration<InferProperty<TTarget>, InferValue<Stroke["var"]>> {
		const { var: var_ } = this;
		const property = target.to_property() as InferProperty<TTarget>;
		return new Declaration(property, var_.to_value());
	}

	protected create_class_block<TTarget extends StrokeTarget>(
		target: TTarget,
	): Block<[ReturnType<Stroke["create_class_declaration"]>]> {
		return new Block(this.create_class_declaration(target));
	}

	protected set_target<TTarget extends Target = "all">(target = "all" as TTarget): StrokeTarget<TTarget> {
		return new StrokeTarget(target);
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference, value } = this;
		const from_map = Stroke.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const declaration = new Declaration(reference.to_property(), value.to_value());
		const ruleset = new Ruleset(selector.to_list(), declaration.to_block());
		this.add_global_ruleset(ruleset);
		return ruleset;
	}

	public class<
		TTarget extends Target = "all",
		TPseudoClass extends PseudoClassName | undefined = undefined,
		PseudoElement extends PseudoElementName | undefined = undefined,
	>(raw_target = "all" as TTarget, options: { pseudo_class?: TPseudoClass; pseudo_element?: PseudoElement } = {}) {
		const target = this.set_target(raw_target);
		const { name: prefix } = target;
		return this.create_selector_class({
			...options,
			target,
			prefix,
		});
	}
}

type Target = ConstructorParameters<typeof StrokeTarget>[0];

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(Stroke.name, () => {
		describe("static [Symbol.iterator]", () => {
			it("iterates through available keys", ({ expect }) => {
				for (const size of Stroke) {
					expect(Stroke.SIZES.has(size)).toBe(true);
					expectTypeOf(size).toEqualTypeOf<StrokeSize>();
				}
			});
		});

		describe("static get(size)", () => {
			it("returns default when no name provided", ({ expect }) => {
				const stroke = Stroke.default();
				expect(stroke).toBeInstanceOf(Stroke);
				expectTypeOf(stroke).toMatchTypeOf<Stroke<typeof Stroke.DEFAULT, Dimension<1, "px">>>();
				expect(stroke.value).toBeInstanceOf(Dimension);
				expectTypeOf(stroke.value).toEqualTypeOf<Dimension<1, "px">>();
			});

			it("on constructed instance subscriber receive instance", ({ expect }) => {
				const observer = vi.fn((instance) => {
					expect(instance).toBeInstanceOf(Stroke);
				});
				Stroke.on("construct").subscribe({
					next: observer,
				});
				Stroke.get("xl");
				expect(observer).toHaveBeenCalled();
			});

			it("returns a Stroke instance for each key", ({ expect }) => {
				for (const size of Stroke) {
					const instance = Stroke.get(size);
					expect(instance).toBeInstanceOf(Stroke);
					expectTypeOf(instance).toMatchTypeOf<Stroke<StrokeSize, Dimension<1 | 2 | 4 | 8 | 12, "px">>>();
				}
				expectTypeOf(Stroke.get("xs")).toEqualTypeOf<Stroke<"xs", Dimension<1, "px">>>();
				expectTypeOf(Stroke.get("s")).toEqualTypeOf<Stroke<"s", Dimension<2, "px">>>();
				expectTypeOf(Stroke.get("m")).toEqualTypeOf<Stroke<"m", Dimension<4, "px">>>();
				expectTypeOf(Stroke.get("l")).toEqualTypeOf<Stroke<"l", Dimension<8, "px">>>();
				expectTypeOf(Stroke.get("xl")).toEqualTypeOf<Stroke<"xl", Dimension<12, "px">>>();
			});

			it("it got cached in the CONSTRUCTED", ({ expect }) => {
				for (const size of Stroke) {
					expect(Stroke.CONSTRUCTED.has(`stroke-${size}`)).toBe(true);
				}
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const stroke = Stroke.default();
				const global = stroke.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(`":root{--stroke-xs:1px;}"`);
			});

			it("created rulesets in Stroke.GLOBAL_RULESETS", ({ expect }) => {
				for (const size of Stroke) {
					const stroke = Stroke.get(size);
					stroke.create_global_ruleset();
					expect(Stroke.GLOBAL_RULESETS.has(size)).toBe(true);
				}
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("stroke-l");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(`":root{--stroke-l:8px;}"`);
				});
				Stroke.on("create-global-ruleset").subscribe({
					next: observer,
				});
				const stroke = Stroke.get("l");
				stroke.create_global_ruleset();
				expect(observer).toHaveBeenCalled();
			});
		});

		describe("class(target?, options?)", () => {
			it("returns correctly when no arguments provided", ({ expect }) => {
				const stroke = Stroke.default();
				const class_name = stroke.class();
				const expected_stringified = "all-stroke-xs";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_stringified);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_stringified>>();
			});

			it("returns correctly when first argument target provided", ({ expect }) => {
				const stroke = Stroke.default();
				const class_name = stroke.class("bottom");
				const expected_name = "bottom-stroke-xs";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const stroke = Stroke.default();
				const class_name = stroke.class("right", { pseudo_class: "hover" });
				const expected_name = "right-stroke-xs-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const stroke = Stroke.default();
				const class_name = stroke.class("top", { pseudo_element: "after" });
				const expected_name = "top-stroke-xs-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const stroke = Stroke.default();
				const class_name = stroke.class("inline", { pseudo_class: "checked", pseudo_element: "before" });
				const expected_name = "inline-stroke-xs-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in Stroke.RULESETS", ({ expect }) => {
				const stroke = Stroke.default();
				const class_name = stroke.class();
				const ruleset = Stroke.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toMatchInlineSnapshot(`".all-stroke-xs{border-width:var(--stroke-xs);}"`);
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("block-end-stroke-l");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`".block-end-stroke-l{border-block-end-width:var(--stroke-l);}"`,
					);
				});
				Stroke.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const stroke = Stroke.get("l");
				stroke.class("block-end");
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}
