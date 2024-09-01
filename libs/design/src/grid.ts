import type { Block } from "@xeho91/lib-css/block";
import { Declaration } from "@xeho91/lib-css/declaration";
import { Ruleset } from "@xeho91/lib-css/ruleset";
import { Selector } from "@xeho91/lib-css/selector";
import { SelectorClass } from "@xeho91/lib-css/selector/class";
import type { PseudoClassName } from "@xeho91/lib-css/selector/pseudo-class";
import type { PseudoElementName } from "@xeho91/lib-css/selector/pseudo-element";
import { SpaceTarget } from "@xeho91/lib-css/target/space";
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import { Range } from "@xeho91/lib-struct/range";
import type { IterableElement } from "@xeho91/lib-type/iterable";

import { Identifier } from "@xeho91/lib-css/identifier";
import { calculateClamp } from "utopia-core";
import { FLUID_CONFIG, type FluidClamp } from "#fluid";
import { DesignToken } from "#token";

export type GridVariant = IterableElement<typeof Grid.VARIANTS>;

export class GridMin<
	TVariant extends GridVariant = GridVariant,
	TValue extends Dimension = Dimension,
> extends DesignToken<"grid-min", TVariant, TValue> {
	public static readonly VALUE = readonly_object({
		default: new Dimension(FLUID_CONFIG.minWidth, "px"),
	} satisfies Record<string, Dimension>);

	public static readonly DEFAULT = "default" satisfies GridVariant;

	public static default = () => GridMin.get(Grid.DEFAULT);

	public static get = <TKey extends GridVariant>(key: TKey) => new GridMin(key, GridMin.VALUE[key]);

	private constructor(variant: TVariant, value: TValue) {
		super({ name: "grid-min", variant, value });
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference, value } = this;
		const from_map = DesignToken.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const declaration = new Declaration(reference.to_property(), value.to_value());
		const ruleset = new Ruleset(selector.to_list(), declaration.to_block());
		this.add_global_ruleset(ruleset);
		return ruleset;
	}

	public set_target<TTarget extends Target>(target: TTarget): SpaceTarget<TTarget> {
		return new SpaceTarget(target);
	}

	protected create_class_block<TTarget extends SpaceTarget>(target: TTarget): Block {
		const { var: var_ } = this;
		const property = target.to_property();
		return new Declaration(property, var_.to_value()).to_block();
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

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(GridMin.name, () => {
		describe("static get(size)", () => {
			it("on construct observer receives an instance", ({ expect }) => {
				const observer = vi.fn((instance) => {
					// expect(instance).toBeInstanceOf(GridMin);
				});
				GridMin.on("construct").subscribe({
					next: observer,
				});
				GridMin.default();
				expect(observer).toHaveBeenCalled();
			});

			it("returns a Grid instance for each variant", ({ expect }) => {
				for (const variant of Grid) {
					const instance = GridMin.get(variant);
					expect(instance).toBeInstanceOf(GridMin);
					expectTypeOf(instance).toMatchTypeOf<GridMin<GridVariant, Dimension>>();
				}
				expectTypeOf(GridMin.get("default")).toMatchTypeOf<GridMin<"default", Dimension<330, "px">>>();
			});

			it("it got cached in the CONSTRUCTED", ({ expect }) => {
				for (const variant of Grid) {
					expect(GridMin.CONSTRUCTED.has(`grid-min-${variant}`)).toBe(true);
				}
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const grid = GridMin.default();
				const global = grid.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(`":root{--grid-min-default:330px;}"`);
			});

			it("created rulesets in Grid.GLOBAL_RULESETS", ({ expect }) => {
				for (const variant of Grid) {
					const grid = GridMin.get(variant);
					grid.create_global_ruleset();
					expect(GridMin.GLOBAL_RULESETS.has(variant)).toBe(true);
				}
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const subscriber = vi.fn((tuple) => {
					// expect(tuple[0]).toMatchInlineSnapshot(`"grid-min-default"`);
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					// expect(tuple[1].toString()).toMatchInlineSnapshot(`":root{--grid-min-default:330px;}"`);
				});
				GridMin.on("create-global-ruleset").subscribe({
					next: subscriber,
				});
				const space = GridMin.default();
				space.create_global_ruleset();
				expect(subscriber).toHaveBeenCalled();
			});
		});

		describe("class(target, options?)", () => {
			it("returns correctly when first argument target provided", ({ expect }) => {
				const grid = GridMin.default();
				const class_name = grid.class("height");
				const expected_name = "height-grid-min-default";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const grid = GridMin.default();
				const class_name = grid.class("width", { pseudo_class: "hover" });
				const expected_name = "width-grid-min-default-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const grid = GridMin.default();
				const class_name = grid.class("row-gap", { pseudo_element: "after" });
				const expected_name = "row-gap-grid-min-default-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const grid = GridMin.default();
				const class_name = grid.class("margin-inline", {
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "margin-inline-grid-min-default-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in Grid.RULESETS", ({ expect }) => {
				const grid = GridMin.default();
				const class_name = grid.class("min-width");
				const ruleset = GridMin.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toMatchInlineSnapshot(
					`".min-width-grid-min-default{min-width:var(--grid-min-default);}"`,
				);
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					// expect(tuple[0]).toMatchInlineSnapshot(`"flex-basis-grid-min-default"`);flex-basis-grid-min-default"``"height-grid-max-default"``"width-grid-max-default-hover"``"row-gap-grid-max-default-after"``"margin-inline-grid-max-default-checked-before"``"min-width-grid-max-default"``"flex-basis-grid-max-default"`);flex-basis-grid-min-default"``"height-grid-max-default"``"width-grid-max-default-hover"``"row-gap-grid-max-default-after"``"margin-inline-grid-max-default-checked-before"``"min-width-grid-max-default"``"flex-basis-grid-max-default"`);flex-basis-grid-min-default"``"height-grid-max-default"``"width-grid-max-default-hover"``"row-gap-grid-max-default-after"``"margin-inline-grid-max-default-checked-before"``"min-width-grid-max-default"``"flex-basis-grid-max-default"`);flex-basis-grid-min-default"``"height-grid-max-default"``"width-grid-max-default-hover"``"row-gap-grid-max-default-after"``"margin-inline-grid-max-default-checked-before"``"min-width-grid-max-default"``"flex-basis-grid-max-default"`);flex-basis-grid-min-default"``"height-grid-max-default"``"width-grid-max-default-hover"``"row-gap-grid-max-default-after"``"margin-inline-grid-max-default-checked-before"``"min-width-grid-max-default"``"flex-basis-grid-max-default"`);flex-basis-grid-min-default"``"height-grid-max-default"``"width-grid-max-default-hover"``"row-gap-grid-max-default-after"``"margin-inline-grid-max-default-checked-before"``"min-width-grid-max-default"``"flex-basis-grid-max-default"`);
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					// expect(tuple[1].toString()).toMatchInlineSnapshot(
					// 	`".flex-basis-grid-min-default{flex-basis:var(--grid-min-default);}"`,
					// );
				});
				GridMin.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const grid = GridMin.default();
				grid.class("flex-basis");
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}

export class GridMax<
	TVariant extends GridVariant = GridVariant,
	TValue extends Dimension = Dimension,
> extends DesignToken<"grid-max", TVariant, TValue> {
	public static readonly VALUE = readonly_object({
		default: new Dimension(FLUID_CONFIG.maxWidth, "px"),
	} satisfies Record<string, Dimension>);

	public static readonly DEFAULT = "default" satisfies GridVariant;

	public static default = () => GridMax.get(Grid.DEFAULT);

	public static get = <TKey extends GridVariant>(key: TKey) => new GridMax(key, GridMax.VALUE[key]);

	private constructor(variant: TVariant, value: TValue) {
		super({ name: "grid-max", variant, value });
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference, value } = this;
		const from_map = DesignToken.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const declaration = new Declaration(reference.to_property(), value.to_value());
		const ruleset = new Ruleset(selector.to_list(), declaration.to_block());
		this.add_global_ruleset(ruleset);
		return ruleset;
	}

	public set_target<TTarget extends Target>(target: TTarget): SpaceTarget<TTarget> {
		return new SpaceTarget(target);
	}

	protected create_class_block<TTarget extends SpaceTarget>(target: TTarget): Block {
		const { var: var_ } = this;
		const property = target.to_property();
		return new Declaration(property, var_.to_value()).to_block();
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

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(GridMax.name, () => {
		describe("static get(size)", () => {
			it("on construct observer receives an instance", ({ expect }) => {
				const observer = vi.fn((instance) => {
					// expect(instance).toBeInstanceOf(GridGutter);
				});
				GridMax.on("construct").subscribe({
					next: observer,
				});
				GridMax.default();
				expect(observer).toHaveBeenCalled();
			});

			it("returns a Grid instance for each variant", ({ expect }) => {
				for (const variant of Grid) {
					const instance = GridMax.get(variant);
					expect(instance).toBeInstanceOf(GridMax);
					expectTypeOf(instance).toMatchTypeOf<GridMax<GridVariant, Dimension>>();
				}
				expectTypeOf(GridMax.get("default")).toMatchTypeOf<GridMax<"default", Dimension<1240, "px">>>();
			});

			it("it got cached in the CONSTRUCTED", ({ expect }) => {
				for (const variant of Grid) {
					expect(GridMax.CONSTRUCTED.has(`grid-max-${variant}`)).toBe(true);
				}
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const grid = GridMax.default();
				const global = grid.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(`":root{--grid-max-default:1240px;}"`);
			});

			it("created rulesets in Grid.GLOBAL_RULESETS", ({ expect }) => {
				for (const variant of Grid) {
					const grid = GridMax.get(variant);
					grid.create_global_ruleset();
					expect(GridMax.GLOBAL_RULESETS.has(variant)).toBe(true);
				}
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const subscriber = vi.fn((tuple) => {
					// expect(tuple[0]).toBe("grid-max-default");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					// expect(tuple[1].toString()).toMatchInlineSnapshot(`":root{--grid-max-default:1240px;}"`);
				});
				GridMax.on("create-global-ruleset").subscribe({
					next: subscriber,
				});
				const space = GridMax.default();
				space.create_global_ruleset();
				expect(subscriber).toHaveBeenCalled();
			});
		});

		describe("class(target, options?)", () => {
			it("returns correctly when first argument target provided", ({ expect }) => {
				const grid = GridMax.default();
				const class_name = grid.class("height");
				const expected_name = "height-grid-max-default";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const grid = GridMax.default();
				const class_name = grid.class("width", { pseudo_class: "hover" });
				const expected_name = "width-grid-max-default-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const grid = GridMax.default();
				const class_name = grid.class("row-gap", { pseudo_element: "after" });
				const expected_name = "row-gap-grid-max-default-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const grid = GridMax.default();
				const class_name = grid.class("margin-inline", {
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "margin-inline-grid-max-default-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in Grid.RULESETS", ({ expect }) => {
				const grid = GridMax.default();
				const class_name = grid.class("min-width");
				const ruleset = GridMax.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toMatchInlineSnapshot(
					`".min-width-grid-max-default{min-width:var(--grid-max-default);}"`,
				);
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					// expect(tuple[0]).toMatchInlineSnapshot(`"flex-basis-grid-gutterter-default"`);
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					// expect(tuple[1].toString()).toMatchInlineSnapshot(
					// 	`".flex-basis-grid-gutter-default{flex-basis:var(--grid-gutter-default);}"`,
					// );
				});
				GridMax.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const grid = GridMax.default();
				grid.class("flex-basis");
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}

export class GridGutter<
	TVariant extends GridVariant = GridVariant,
	const TValue extends [GridMin, GridMax] = [GridMin, GridMax],
> extends DesignToken<"grid-gutter", TVariant, TValue> {
	static readonly #VALUE = [18, 40] as const;

	public static readonly DEFAULT = "default" satisfies GridVariant;

	public static default = () => GridGutter.get(Grid.DEFAULT);

	public static get = <TKey extends GridVariant>(key: TKey) =>
		new GridGutter(key, [GridMin.get(key), GridMax.get(key)]);

	constructor(variant: TVariant, value: TValue) {
		super({ name: "grid-gutter", variant, value });
	}

	get clamp(): FluidClamp {
		const [minSize, maxSize] = GridGutter.#VALUE;
		return calculateClamp({
			...FLUID_CONFIG,
			minSize,
			maxSize,
		}) as FluidClamp;
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference } = this;
		const from_map = GridGutter.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const declaration = new Declaration(reference.to_property(), new Identifier(this.clamp).to_value());
		const ruleset = new Ruleset(selector.to_list(), declaration.to_block());
		this.add_global_ruleset(ruleset);
		return ruleset;
	}

	public set_target<TTarget extends Target>(target: TTarget): SpaceTarget<TTarget> {
		return new SpaceTarget(target);
	}

	protected create_class_block<TTarget extends SpaceTarget>(target: TTarget): Block {
		const { var: var_ } = this;
		const property = target.to_property();
		return new Declaration(property, var_.to_value()).to_block();
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

if (import.meta.vitest) {
	const { describe, expectTypeOf, it, vi } = import.meta.vitest;

	describe(GridGutter.name, () => {
		describe("static get(size)", () => {
			it("on construct observer receives an instance", ({ expect }) => {
				const observer = vi.fn((instance) => {
					expect(instance).toBeInstanceOf(GridGutter);
				});
				GridGutter.on("construct").subscribe({
					next: observer,
				});
				GridGutter.default();
				expect(observer).toHaveBeenCalled();
			});

			it("returns a Grid instance for each variant", ({ expect }) => {
				for (const variant of Grid) {
					const instance = GridGutter.get(variant);
					expect(instance).toBeInstanceOf(GridGutter);
					expectTypeOf(instance).toMatchTypeOf<GridGutter<GridVariant, [GridMin, GridMax]>>();
				}
				expectTypeOf(GridGutter.get("default")).toMatchTypeOf<GridGutter<"default", [GridMin, GridMax]>>();
			});

			it("it got cached in the CONSTRUCTED", ({ expect }) => {
				for (const variant of Grid) {
					expect(GridGutter.CONSTRUCTED.has(`grid-gutter-${variant}`)).toBe(true);
				}
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const grid = GridGutter.default();
				const global = grid.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(
					`":root{--grid-gutter-default:clamp(20.625rem, 0rem + 100cqi, 77.5rem);}"`,
				);
			});

			it("created rulesets in Grid.GLOBAL_RULESETS", ({ expect }) => {
				for (const variant of Grid) {
					const grid = GridGutter.get(variant);
					grid.create_global_ruleset();
					expect(GridGutter.GLOBAL_RULESETS.has(variant)).toBe(true);
				}
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const subscriber = vi.fn((tuple) => {
					expect(tuple[0]).toBe("grid-gutter-default");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`":root{--grid-gutter-default:clamp(20.625rem, 0rem + 100cqi, 77.5rem);}"`,
					);
				});
				GridGutter.on("create-global-ruleset").subscribe({
					next: subscriber,
				});
				const space = GridGutter.default();
				space.create_global_ruleset();
				expect(subscriber).toHaveBeenCalled();
			});
		});

		describe("class(target, options?)", () => {
			it("returns correctly when first argument target provided", ({ expect }) => {
				const grid = GridGutter.default();
				const class_name = grid.class("height");
				const expected_name = "height-grid-gutter-default";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const grid = GridGutter.default();
				const class_name = grid.class("width", { pseudo_class: "hover" });
				const expected_name = "width-grid-gutter-default-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const grid = GridGutter.default();
				const class_name = grid.class("row-gap", { pseudo_element: "after" });
				const expected_name = "row-gap-grid-gutter-default-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const grid = GridGutter.default();
				const class_name = grid.class("margin-inline", {
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "margin-inline-grid-gutter-default-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in Grid.RULESETS", ({ expect }) => {
				const grid = GridGutter.default();
				const class_name = grid.class("min-width");
				const ruleset = GridGutter.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toMatchInlineSnapshot(
					`".min-width-grid-gutter-default{min-width:var(--grid-gutter-default);}"`,
				);
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toMatchInlineSnapshot(`"flex-basis-grid-gutter-default"`);
					expect(tuple[1]).toBeInstanceOf(Ruleset);
					expect(tuple[1].toString()).toMatchInlineSnapshot(
						`".flex-basis-grid-gutter-default{flex-basis:var(--grid-gutter-default);}"`,
					);
				});
				GridGutter.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const grid = GridGutter.default();
				grid.class("flex-basis");
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}

/**
 * Design token keys for the grid width.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/max-width}
 */
// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative for statics?
export class Grid {
	/**
	 * Available design token variants for the grid width.
	 */
	public static readonly VARIANTS = readonly_set(["default"]);

	public static [Symbol.iterator](): IterableIterator<GridVariant> {
		return Grid.VARIANTS[Symbol.iterator]();
	}

	public static readonly DEFAULT = "default" satisfies GridVariant;

	public static readonly COLUMNS = new Range(1, 12);

	public static min = GridMin;
	public static max = GridMax;
	public static gutter = GridGutter;
}

type Target = ConstructorParameters<typeof SpaceTarget>[0];

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(Grid.name, () => {
		describe("static [Symbol.iterator]", () => {
			it("iterates through available variants", ({ expect }) => {
				for (const variant of Grid) {
					expect(Grid.VARIANTS.has(variant)).toBe(true);
					expectTypeOf(variant).toEqualTypeOf<GridVariant>();
				}
			});
		});
	});
}
