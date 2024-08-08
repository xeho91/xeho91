import { Block } from "@xeho91/lib-css/block";
import { Declaration } from "@xeho91/lib-css/declaration";
import { Identifier } from "@xeho91/lib-css/identifier";
import type { InferProperty } from "@xeho91/lib-css/property";
import { Ruleset } from "@xeho91/lib-css/ruleset";
import { Selector } from "@xeho91/lib-css/selector";
import { SelectorClass } from "@xeho91/lib-css/selector/class";
import type { PseudoClassName } from "@xeho91/lib-css/selector/pseudo-class";
import type { PseudoElementName } from "@xeho91/lib-css/selector/pseudo-element";
import { SpaceTarget } from "@xeho91/lib-css/target/space";
import type { InferValue } from "@xeho91/lib-css/value";
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import { Range } from "@xeho91/lib-struct/range";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import { calculateClamp } from "utopia-core";

import { FLUID_CONFIG, type FluidClamp } from "#fluid";
import { DesignToken } from "#token";

export type GridKey = IterableElement<typeof Grid.VARIANTS>;

interface GridProperties {
	min: Dimension;
	max: Dimension;
}

/**
 * Design token keys for the grid width.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/max-width}
 */
export class Grid<
	TVariant extends GridKey = GridKey,
	const TValue extends GridProperties = GridProperties,
> extends DesignToken<"grid", TVariant, TValue> {
	public static readonly VALUE = readonly_object({
		default: {
			min: new Dimension(FLUID_CONFIG.minWidth, "px"),
			max: new Dimension(FLUID_CONFIG.maxWidth, "px"),
		},
	} satisfies Record<string, GridProperties>);

	/**
	 * Available design token variants for the grid width.
	 */
	public static readonly VARIANTS = readonly_set(object_keys(Grid.VALUE));

	public static [Symbol.iterator](): IterableIterator<GridKey> {
		return Grid.VARIANTS[Symbol.iterator]();
	}

	public static readonly DEFAULT = "default" satisfies GridKey;

	public static default = () => Grid.get(Grid.DEFAULT);

	public static get = <Key extends GridKey = typeof Grid.DEFAULT>(key: Key) => new Grid(key, Grid.VALUE[key]);

	public static readonly COLUMNS = new Range(1, 12);

	private constructor(variant: TVariant, value: TValue) {
		super({
			name: "grid",
			variant,
			value,
		});
	}

	public set_target<TTarget extends Target>(target: TTarget): SpaceTarget<TTarget> {
		return new SpaceTarget(target);
	}

	protected create_class_declaration<TTarget extends SpaceTarget>(
		target: TTarget,
	): Declaration<InferProperty<TTarget>, InferValue<Grid["var"]>> {
		const { var: var_ } = this;
		const property = target.to_property() as InferProperty<TTarget>;
		return new Declaration(property, var_.to_value());
	}

	protected create_class_block<TTarget extends SpaceTarget>(
		target: TTarget,
	): Block<[ReturnType<Grid["create_class_declaration"]>]> {
		return new Block(this.create_class_declaration(target));
	}

	public get min(): TValue["min"] {
		const { value } = this;
		const { min } = value;
		return min;
	}

	public get max(): TValue["max"] {
		const { value } = this;
		const { max } = value;
		return max;
	}

	public get gutter(): Identifier<FluidClamp> {
		const { min, max } = this;
		return new Identifier(
			calculateClamp({
				...FLUID_CONFIG,
				minSize: min.value,
				maxSize: max.value,
			}) as FluidClamp,
		);
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference, min, max, gutter } = this;
		const from_map = Grid.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const declaration_min_width = new Declaration(reference.add_prefix("min").to_property(), min.to_value());
		const declaration_max_width = new Declaration(reference.add_prefix("max").to_property(), max.to_value());
		const declaration_gutter = new Declaration(reference.add_prefix("gutter").to_property(), gutter.to_value());
		const ruleset = new Ruleset(
			selector.to_list(),
			new Block(
				//
				declaration_min_width,
				declaration_max_width,
				declaration_gutter,
			),
		);
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

type Target = ConstructorParameters<typeof SpaceTarget>[0];

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(Grid.name, () => {
		describe("static [Symbol.iterator]", () => {
			it("iterates through available variants", ({ expect }) => {
				for (const variant of Grid) {
					expect(Grid.VARIANTS.has(variant)).toBe(true);
					expectTypeOf(variant).toEqualTypeOf<GridKey>();
				}
			});
		});

		describe("static get(size)", () => {
			it("on construct observer receives an instance", ({ expect }) => {
				const observer = vi.fn((instance) => {
					expect(instance).toBeInstanceOf(Grid);
				});
				Grid.on("construct").subscribe({
					next: observer,
				});
				Grid.default();
				expect(observer).toHaveBeenCalled();
			});

			it("returns a Grid instance for each variant", ({ expect }) => {
				for (const variant of Grid) {
					const instance = Grid.get(variant);
					expect(instance).toBeInstanceOf(Grid);
					expectTypeOf(instance).toMatchTypeOf<Grid<GridKey, GridProperties>>();
				}
				expectTypeOf(Grid.get("default")).toMatchTypeOf<Grid<"default", GridProperties>>();
			});

			it("it got cached in the CONSTRUCTED", ({ expect }) => {
				for (const variant of Grid) {
					expect(Grid.CONSTRUCTED.has(`grid-${variant}`)).toBe(true);
				}
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const grid = Grid.default();
				const global = grid.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(
					`":root{--min-grid-default:330px;--max-grid-default:1240px;--gutter-grid-default:clamp(20.625rem, 0rem + 100cqi, 77.5rem)}"`,
				);
			});

			it("created rulesets in Grid.GLOBAL_RULESETS", ({ expect }) => {
				for (const variant of Grid) {
					const grid = Grid.get(variant);
					grid.create_global_ruleset();
					expect(Grid.GLOBAL_RULESETS.has(variant)).toBe(true);
				}
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const subscriber = vi.fn((tuple) => {
					expect(tuple[0]).toBe("grid-default");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
				});
				Grid.on("create-global-ruleset").subscribe({
					next: subscriber,
				});
				const space = Grid.default();
				space.create_global_ruleset();
				expect(subscriber).toHaveBeenCalled();
			});
		});

		describe("class_name(target, options?)", () => {
			it("returns correctly when first argument target provided", ({ expect }) => {
				const grid = Grid.default();
				const class_name = grid.class("height");
				const expected_name = "height-grid-default";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const grid = Grid.default();
				const class_name = grid.class("width", { pseudo_class: "hover" });
				const expected_name = "width-grid-default-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const grid = Grid.default();
				const class_name = grid.class("row-gap", { pseudo_element: "after" });
				const expected_name = "row-gap-grid-default-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const grid = Grid.default();
				const class_name = grid.class("margin-inline", {
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "margin-inline-grid-default-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in Grid.RULESETS", ({ expect }) => {
				const grid = Grid.default();
				const class_name = grid.class("min-width");
				const ruleset = Grid.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toBe(".min-width-grid-default{min-width:var(--grid-default)}");
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("flex-basis-grid-default");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
				});
				Grid.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const grid = Grid.default();
				grid.class("flex-basis");
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}
