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
import { object_keys, readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import { Range } from "@xeho91/lib-struct/range";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import { calculateClamp } from "utopia-core";

import { FLUID_CONFIG, type FluidClamp } from "#fluid";
import { DesignToken } from "#token";

export type SpaceSize = IterableElement<typeof Space.SIZES>;

/**
 * Design token keys for the space.
 * NOTE: It can be used for padding, margin, gap, and other  properties which would create a space.
 */
export class Space<TSize extends SpaceSize = SpaceSize, TValue extends Range = Range> extends DesignToken<
	typeof Space.NAME,
	TSize,
	TValue
> {
	public static readonly NAME = "space";

	public static readonly VALUE = readonly_object({
		"3xs": new Range(4, 5),
		"2xs": new Range(8, 10),
		xs: new Range(14, 15),
		s: new Range(18, 20),
		m: new Range(27, 30),
		l: new Range(36, 40),
		xl: new Range(54, 60),
		"2xl": new Range(72, 80),
		"3xl": new Range(108, 120),
	});

	/**
	 * Available design token keys for the space.
	 */
	public static readonly SIZES = readonly_set(object_keys(Space.VALUE));

	public static [Symbol.iterator](): IterableIterator<SpaceSize> {
		return Space.SIZES[Symbol.iterator]();
	}

	public static readonly DEFAULT = "l" satisfies SpaceSize;

	public static default = () => Space.get(Space.DEFAULT);

	public static get = <TSize extends SpaceSize>(size: TSize): Space<TSize, (typeof Space.VALUE)[TSize]> => {
		const cached = Space.CONSTRUCTED.get(size);
		if (cached) return cached as Space<TSize, (typeof Space.VALUE)[TSize]>;
		return new Space(size, Space.VALUE[size]);
	};

	private constructor(size: TSize, range: TValue) {
		super({ name: Space.NAME, variant: size, value: range });
	}

	/**
	 * Get the  clamp function for calculating the value of this space token.
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web//clamp}
	 */
	public get clamp() {
		const { value } = this;
		const { min, max } = value;
		const stringified = calculateClamp({
			...FLUID_CONFIG,
			minSize: min,
			maxSize: max,
		}) as FluidClamp;
		return new Identifier(stringified);
	}

	public set_target<TTarget extends Target>(target: TTarget): SpaceTarget<TTarget> {
		return new SpaceTarget(target);
	}

	protected create_class_declaration<TTarget extends SpaceTarget>(
		target: TTarget,
	): Declaration<InferProperty<TTarget>, InferValue<Space["var"]>> {
		const { var: var_ } = this;
		const property = target.to_property() as InferProperty<TTarget>;
		return new Declaration(property, var_.to_value());
	}

	protected create_class_block<TTarget extends SpaceTarget>(
		target: TTarget,
	): Block<[ReturnType<Space["create_class_declaration"]>]> {
		return new Block(this.create_class_declaration(target));
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference, clamp } = this;
		const from_map = Space.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const declaration = new Declaration(reference.to_property(), clamp.to_value());
		const ruleset = new Ruleset(selector.to_list(), declaration.to_block());
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

	describe(Space.name, () => {
		describe("static [Symbol.iterator]", () => {
			it("iterates through available keys", ({ expect }) => {
				for (const size of Space) {
					expect(Space.SIZES.has(size)).toBe(true);
					expectTypeOf(size).toEqualTypeOf<SpaceSize>();
				}
			});
		});

		describe("static get(size?)", () => {
			it("on constructed instance subscriber receive instance", ({ expect }) => {
				const subscriber = vi.fn((instance) => {
					expect(instance).toBeInstanceOf(Space);
				});
				Space.on("construct").subscribe({
					next: subscriber,
				});
				Space.get("xl");
				expect(subscriber).toHaveBeenCalled();
			});

			it("returns a Space instance for each key", ({ expect }) => {
				for (const size of Space) {
					const instance = Space.get(size);
					expect(instance).toBeInstanceOf(Space);
					expectTypeOf(instance).toMatchTypeOf<Space<SpaceSize, Range<number, number>>>();
				}
				expectTypeOf(Space.get("2xs")).toMatchTypeOf<Space<"2xs", Range>>();
				expectTypeOf(Space.get("xs")).toMatchTypeOf<Space<"xs", Range>>();
				expectTypeOf(Space.get("s")).toMatchTypeOf<Space<"s", Range>>();
				expectTypeOf(Space.get("m")).toMatchTypeOf<Space<"m", Range>>();
				expectTypeOf(Space.get("l")).toMatchTypeOf<Space<"l", Range>>();
				expectTypeOf(Space.get("xl")).toMatchTypeOf<Space<"xl", Range>>();
				expectTypeOf(Space.get("2xl")).toMatchTypeOf<Space<"2xl", Range>>();
				expectTypeOf(Space.get("3xl")).toMatchTypeOf<Space<"3xl", Range>>();
			});

			it("it got cached in the CONSTRUCTED", ({ expect }) => {
				for (const size of Space) {
					expect(Space.CONSTRUCTED.has(`space-${size}`)).toBe(true);
				}
			});
		});

		describe("create_global_ruleset()", () => {
			it("returns a ruleset", ({ expect }) => {
				const space = Space.default();
				const global = space.create_global_ruleset();
				const stringified = global.toString();
				expect(stringified).toMatchInlineSnapshot(
					`":root{--space-l:clamp(2.25rem, 2.1593rem + 0.4396cqi, 2.5rem)}"`,
				);
			});

			it("created rulesets in Space.GLOBAL_RULESETS", ({ expect }) => {
				for (const size of Space) {
					const space = Space.get(size);
					space.create_global_ruleset();
					expect(Space.GLOBAL_RULESETS.has(size)).toBe(true);
				}
			});

			it("on created global ruleset subscriber receive [key, ruleset] tuple", ({ expect }) => {
				const subscriber = vi.fn((tuple) => {
					expect(tuple[0]).toBe("space-l");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
				});
				Space.on("create-global-ruleset").subscribe({
					next: subscriber,
				});
				const space = Space.get("l");
				space.create_global_ruleset();
				expect(subscriber).toHaveBeenCalled();
			});
		});

		describe("class_name(target, options?)", () => {
			it("returns correctly when first argument target provided", ({ expect }) => {
				const space = Space.default();
				const class_name = space.class("height");
				const expected_name = "height-space-l";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo class", ({ expect }) => {
				const space = Space.default();
				const class_name = space.class("width", { pseudo_class: "hover" });
				const expected_name = "width-space-l-hover";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided pseudo element", ({ expect }) => {
				const space = Space.default();
				const class_name = space.class("row-gap", { pseudo_element: "after" });
				const expected_name = "row-gap-space-l-after";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("returns correctly when provided both pseudos", ({ expect }) => {
				const space = Space.default();
				const class_name = space.class("margin-inline", {
					pseudo_class: "checked",
					pseudo_element: "before",
				});
				const expected_name = "margin-inline-space-l-checked-before";
				expect(class_name).toBeInstanceOf(SelectorClass);
				expect(class_name.name).toBe(expected_name);
				expectTypeOf(class_name).toEqualTypeOf<SelectorClass<typeof expected_name>>();
			});

			it("created rulesets in Space.RULESETS", ({ expect }) => {
				const space = Space.default();
				const class_name = space.class("gap");
				const ruleset = Space.RULESETS.get(class_name.name);
				expect(ruleset).toBeDefined();
				expect(ruleset?.toString()).toBe(".gap-space-l{gap:var(--space-l)}");
			});

			it("on created class ruleset subscriber receive [class_name, ruleset] tuple", ({ expect }) => {
				const observer = vi.fn((tuple) => {
					expect(tuple[0]).toBe("flex-basis-space-l");
					expect(tuple[1]).toBeInstanceOf(Ruleset);
				});
				Space.on("create-class-ruleset").subscribe({
					next: observer,
				});
				const space = Space.get("l");
				space.class("flex-basis");
				expect(observer).toHaveBeenCalled();
			});
		});
	});
}
