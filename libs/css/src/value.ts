import type { Join } from "@xeho91/lib-type/array";
import type { Display, InferDisplays } from "@xeho91/lib-type/trait/display";
import { IterableInstance } from "@xeho91/lib-type/trait/iterable";
import { List, type Value as ValueAST } from "css-tree";

import type { ToAST } from "#ast";
import type { Identifier } from "#identifier";

export type Item = ToAST;

export class Value<const TList extends Item[] = Item[]>
	extends IterableInstance<TList[number]>
	implements Display, ToAST
{
	protected iterable: TList;

	constructor(...list: TList) {
		super();
		this.iterable = list;
	}

	public get list(): TList {
		return this.iterable;
	}

	public set list(list: TList) {
		this.iterable = list;
	}

	public toString(): Stringified<TList> {
		const { list } = this;
		let results = "";
		let index = 0;
		for (const value of list) {
			results += value.toString();
			const next = list[index + 1];
			if (next) results += " ";
			index++;
		}
		return results as Stringified<TList>;
	}

	public to_ast(): ValueAST {
		const { list } = this;
		const children = new List<ReturnType<Item["to_ast"]>>();
		for (const value of list) children.push(value.to_ast());
		return {
			type: "Value",
			children,
		};
	}
}

type Stringified<TList extends Item[]> = Join<InferDisplays<TList>, " ">;

export interface ToValue {
	/**
	 * Convert current instance to {@link Value}
	 */
	to_value(): Value;
}

/**
 * Infer the {@link Value} from instance
 */
export type InferValue<T extends ToValue> = ReturnType<T["to_value"]>;

if (import.meta.vitest) {
	const { describe, it, expectTypeOf } = import.meta.vitest;
	const { Identifier } = await import("#identifier");
	const { generate } = await import("css-tree");

	describe(Value.name, () => {
		describe("constructor", () => {
			it("allows creating empty value", ({ expect }) => {
				const value = new Value();
				expect(value).toBeInstanceOf(Value);
				expectTypeOf(value).toEqualTypeOf<Value<[]>>();
			});

			it("allows storing single instance", ({ expect }) => {
				const value = new Value(new Identifier("transparent"));
				expect(value).toBeInstanceOf(Value);
				expect(value.list).toHaveLength(1);
				expectTypeOf(value).toEqualTypeOf<Value<[Identifier<"transparent">]>>();
			});

			it("allows storing multiple instance", ({ expect }) => {
				const value = new Value(new Identifier("transparent"), new Identifier("red"));
				expect(value).toBeInstanceOf(Value);
				expect(value.list).toHaveLength(2);
				expectTypeOf(value).toEqualTypeOf<Value<[Identifier<"transparent">, Identifier<"red">]>>();
			});
		});

		describe("[Symbol.iterator]", () => {
			it("allows iterating over multiple values", ({ expect }) => {
				const _1_item = new Identifier("transparent");
				const _2_item = new Identifier("red");
				const value = new Value(_1_item, _2_item);
				for (const item of value) {
					expect(item).toBeInstanceOf(Identifier);
				}
				expect(value.list).toContain(_1_item);
				expect(value.list).toContain(_2_item);
				expect(value.list[0]).toBe(_1_item);
				expectTypeOf(value.list[0]).toEqualTypeOf<typeof _1_item>();
				expect(value.list[1]).toBe(_2_item);
				expectTypeOf(value.list[1]).toEqualTypeOf<typeof _2_item>();
				expectTypeOf(value.list).toEqualTypeOf<[Identifier<"transparent">, Identifier<"red">]>();
			});
		});

		describe("toString()", () => {
			it("returns correctly for empty value list", ({ expect }) => {
				const value = new Value();
				const stringified = value.toString();
				expect(stringified).toBe("");
				expectTypeOf(stringified).toEqualTypeOf<"">();
			});

			it("returns correctly for single stored value", ({ expect }) => {
				const value = new Value(new Identifier("transparent"));
				const stringified = value.toString();
				expect(stringified).toBe("transparent");
				expectTypeOf(stringified).toEqualTypeOf<"transparent">();
			});

			it("returns correctly for multiple stored values", ({ expect }) => {
				const _1_item = new Identifier("transparent");
				const _2_item = new Identifier("red");
				const value = new Value(_1_item, _2_item);
				const stringified = value.toString();
				expect(stringified).toBe("transparent red");
				expectTypeOf(stringified).toEqualTypeOf<"transparent red">();
			});
		});

		describe("to_ast()", () => {
			it("works for empty stored value", ({ expect }) => {
				const value = new Value();
				const node = value.to_ast();
				const stringified = generate(node);
				expect(stringified).toBe("");
			});

			it("returns correctly for single stored value", ({ expect }) => {
				const value = new Value(new Identifier("transparent"));
				const node = value.to_ast();
				const stringified = generate(node);
				expect(stringified).toBe("transparent");
			});

			it("returns correctly for multiple stored values", ({ expect }) => {
				const _1_item = new Identifier("transparent");
				const _2_item = new Identifier("red");
				const value = new Value(_1_item, _2_item);
				const node = value.to_ast();
				const stringified = generate(node);
				expect(stringified).toBe("transparent red");
			});
		});
	});
}
