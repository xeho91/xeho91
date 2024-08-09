import { Block } from "@xeho91/lib-css/block";
import { Declaration } from "@xeho91/lib-css/declaration";
import type { InferProperty } from "@xeho91/lib-css/property";
import { Ruleset } from "@xeho91/lib-css/ruleset";
import { Selector } from "@xeho91/lib-css/selector";
import { SelectorClass } from "@xeho91/lib-css/selector/class";
import type { PseudoClassName } from "@xeho91/lib-css/selector/pseudo-class";
import type { PseudoElementName } from "@xeho91/lib-css/selector/pseudo-element";
import { RadiusTarget } from "@xeho91/lib-css/target/radius";
import { Unit } from "@xeho91/lib-css/unit";
import type { InferValue } from "@xeho91/lib-css/value";
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { DesignToken } from "#token";

export type RadiusSize = IterableElement<typeof Radius.SIZES>;

type Name = typeof Radius.NAME;

/**
 * Design token for the border radius.
 */
export class Radius<TSize extends RadiusSize = RadiusSize, TValue extends Dimension = Dimension> extends DesignToken<
	Name,
	TSize,
	TValue
> {
	public static readonly NAME = "radius";

	public static readonly VALUE = readonly_object({
		xs: new Dimension(1, "px"),
		s: new Dimension(2, "px"),
		m: new Dimension(4, "px"),
		l: new Dimension(8, "px"),
		xl: new Dimension(12, "px"),
		circle: new Dimension(9999, "px"),
	});

	/**
	 * Available design token keys for the radius.
	 */
	public static readonly SIZES = readonly_set(object_keys(Radius.VALUE));

	public static [Symbol.iterator](): IterableIterator<RadiusSize> {
		return Radius.SIZES[Symbol.iterator]();
	}

	/**
	 * Default design token key for the radius.
	 */
	public static readonly DEFAULT = "s" satisfies RadiusSize;

	public static default = () => Radius.get(Radius.DEFAULT);

	public static get = <TSize extends RadiusSize>(size: TSize): Radius<TSize, (typeof Radius.VALUE)[TSize]> => {
		const cached = Radius.CONSTRUCTED.get(size);
		if (cached) return cached as Radius<TSize, (typeof Radius.VALUE)[TSize]>;
		return new Radius(size, Radius.VALUE[size]);
	};

	constructor(key: TSize, value: TValue) {
		super({ name: Radius.NAME, variant: key, value });
	}

	public set_target<TTarget extends Target>(target: TTarget): RadiusTarget<TTarget> {
		return new RadiusTarget(target);
	}

	protected create_class_declaration<TTarget extends RadiusTarget>(
		target: TTarget,
	): Declaration<InferProperty<TTarget>, InferValue<Radius["var"]>> {
		const { var: var_ } = this;
		const property = target.to_property() as InferProperty<TTarget>;
		return new Declaration(property, var_.to_value());
	}

	protected create_class_block<TTarget extends RadiusTarget>(
		target: TTarget,
	): Block<[ReturnType<Radius["create_class_declaration"]>]> {
		return new Block(this.create_class_declaration(target));
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference, value } = this;
		const from_map = Radius.GLOBAL_RULESETS.get(key);
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
		TPseudoElement extends PseudoElementName | undefined = undefined,
	>(raw_target = "all" as TTarget, options: { pseudo_class?: TPseudoClass; pseudo_element?: TPseudoElement } = {}) {
		const target = this.set_target(raw_target);
		const { name: prefix } = target;
		return this.create_selector_class({
			...options,
			target,
			prefix,
		});
	}
}

type Target = ConstructorParameters<typeof RadiusTarget>[0];

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(Radius.name, () => {
		describe("static [Symbol.iterator]", () => {
			it("iterates through available keys", ({ expect }) => {
				for (const size of Radius) {
					expect(Radius.SIZES.has(size)).toBe(true);
					expectTypeOf(size).toEqualTypeOf<RadiusSize>();
				}
			});
		});

		describe("static get(size?)", () => {
			it("returns default when no name provided", ({ expect }) => {
				const radius = Radius.default();
				expect(radius).toBeInstanceOf(Radius);
				expectTypeOf(radius).toEqualTypeOf<Radius<typeof Radius.DEFAULT, Dimension<2, "px">>>();
				expect(radius.value).toBeInstanceOf(Dimension);
				expectTypeOf(radius.value).toEqualTypeOf<Dimension<2, "px">>();
				expect(radius.value.value).toBe(2);
				expectTypeOf(radius.value.value).toEqualTypeOf<2>();
				expect(radius.value.unit).toBeInstanceOf(Unit);
				expectTypeOf(radius.value.unit).toEqualTypeOf<Unit<"px">>();
				expect(radius.value.unit.name).toBe("px");
				expectTypeOf(radius.value.unit.name).toEqualTypeOf<"px">();
			});

			it("on constructed instance subscriber receive instance", ({ expect }) => {
				const observer = vi.fn((instance) => {
					expect(instance).toBeInstanceOf(Radius);
				});
				Radius.on("construct").subscribe({
					next: observer,
				});
				Radius.get("xl");
				expect(observer).toHaveBeenCalled();
			});

			it("returns a Radius instance for each key", ({ expect }) => {
				for (const size of Radius) {
					const instance = Radius.get(size);
					expect(instance).toBeInstanceOf(Radius);
					expectTypeOf(instance).toMatchTypeOf<
						Radius<RadiusSize, Dimension<1 | 2 | 4 | 8 | 12 | 9999, "px">>
					>();
				}
				expectTypeOf(Radius.get("xs")).toMatchTypeOf<Radius<"xs", Dimension<1, "px">>>();
				expectTypeOf(Radius.get("s")).toMatchTypeOf<Radius<"s", Dimension<2, "px">>>();
				expectTypeOf(Radius.get("m")).toMatchTypeOf<Radius<"m", Dimension<4, "px">>>();
				expectTypeOf(Radius.get("l")).toMatchTypeOf<Radius<"l", Dimension<8, "px">>>();
				expectTypeOf(Radius.get("xl")).toMatchTypeOf<Radius<"xl", Dimension<12, "px">>>();
				expectTypeOf(Radius.get("circle")).toMatchTypeOf<Radius<"circle", Dimension<9999, "px">>>();
			});

			it("it got cached in the CONSTRUCTED", ({ expect }) => {
				for (const size of Radius) {
					expect(Radius.CONSTRUCTED.has(`radius-${size}`)).toBe(true);
				}
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const radius = Radius.default();
				const global = radius.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(`":root{--radius-s:2px}"`);
			});

			it("created rulesets in Radius.GLOBAL_RULESETS", ({ expect }) => {
				for (const size of Radius) {
					const radius = Radius.get(size);
					radius.create_global_ruleset();
					expect(Radius.GLOBAL_RULESETS.has(size)).toBe(true);
				}
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("radius-l");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(`":root{--radius-l:8px}"`);
				});
				Radius.on("create-global-ruleset").subscribe({
					next: observer,
				});
				const radius = Radius.get("l");
				radius.create_global_ruleset();
				expect(observer).toHaveBeenCalled();
			});
		});

		describe("class(target?, options?)", () => {
			it("returns correctly when no arguments provided", ({ expect }) => {
				const radius = Radius.default();
				const class_name = radius.class();
				const expected_stringified = "all-radius-s";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_stringified);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_stringified>>();
			});

			it("returns correctly when first argument target provided", ({ expect }) => {
				const radius = Radius.default();
				const class_name = radius.class("top-left");
				const expected_name = "top-left-radius-s";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const radius = Radius.default();
				const class_name = radius.class("end-end", { pseudo_class: "hover" });
				const expected_name = "end-end-radius-s-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const radius = Radius.default();
				const class_name = radius.class("top-right", { pseudo_element: "after" });
				const expected_name = "top-right-radius-s-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const radius = Radius.default();
				const class_name = radius.class("bottom-left", {
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "bottom-left-radius-s-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in Radius.RULESETS", ({ expect }) => {
				const radius = Radius.default();
				const class_name = radius.class("start-end");
				const ruleset = Radius.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toBe(".start-end-radius-s{border-start-end-radius:var(--radius-s)}");
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("start-end-radius-l");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`".start-end-radius-l{border-start-end-radius:var(--radius-l)}"`,
					);
				});
				Radius.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const space = Radius.get("l");
				space.class("start-end");
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}
