import { readonly_object } from "@xeho91/lib-snippet/object";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";

import { type ToValue, Value } from "#value";
import { StringCSS } from "#value/string";

export type SyntaxName = IterableElement<typeof Syntax.NAMES>;

export class Syntax<TName extends SyntaxName = SyntaxName> implements Display, ToValue {
	public static readonly NAMES = readonly_set([
		//
		"angle",
		"color",
		"length",
		"number",
		"percentage",
	]);

	public static readonly UNITS = readonly_object({
		angle: readonly_set(["deg", "turn"]),
		color: undefined,
		length: readonly_set([
			"px",
			"vw",
			"vh",
			"dvw",
			"dvh",
			"lvw",
			"lvh",
			"cqw",
			"cqh",
			"cqi",
			"cqb",
			"cqmin",
			"cqmax",
		]),
		number: undefined,
		percentage: readonly_set(["%"]),
	} satisfies Record<SyntaxName, ReadonlySet<string> | undefined>);

	public static [Symbol.iterator](): IterableIterator<SyntaxName> {
		return Syntax.NAMES[Symbol.iterator]();
	}

	#name: TName;

	constructor(name: TName) {
		this.#name = name;
	}

	public get name(): TName {
		return this.#name;
	}

	public set name(name: TName) {
		this.#name = name;
	}

	public valueOf(): TName {
		return this.name;
	}

	public toString(): Stringified<TName> {
		return `<${this.#name}>`;
	}

	public get units(): (typeof Syntax.UNITS)[TName] {
		return Syntax.UNITS[this.#name];
	}

	public to_css_string(): StringCSS<ReturnType<typeof this.toString>> {
		return new StringCSS(this.toString());
	}

	public to_value(): Value<[ReturnType<typeof this.to_css_string>]> {
		return new Value(this.to_css_string());
	}
}

type Stringified<TName extends SyntaxName> = `<${TName}>`;

type SyntaxUnitsSet<TSyntax extends SyntaxName> = (typeof Syntax.UNITS)[TSyntax];
export type SyntaxUnits<TSyntax extends SyntaxName> = keyof SyntaxUnitsSet<TSyntax> extends undefined
	? undefined
	: IterableElement<SyntaxUnitsSet<TSyntax>>;

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(Syntax.name, () => {
		describe("static [Symbol.iterator]()", () => {
			it("iterates correctly over the static readonly set of names", ({ expect }) => {
				const names: string[] = [];
				for (const name of Syntax) {
					expect(Syntax.NAMES.has(name)).toBe(true);
					names.push(name);
				}
				expect(names.length).toBe(Syntax.NAMES.size);
				expect(new Set(names)).toEqual(Syntax.NAMES);
			});
		});

		describe("constructor", () => {
			it("constructs correctly", ({ expect }) => {
				expect(new Syntax("number")).toBeInstanceOf(Syntax);
			});
		});

		describe("toString()", () => {
			it("wraps correctly name with angle brackets", ({ expect }) => {
				const stringified = new Syntax("number").toString();
				expect(stringified).toBe("<number>");
				expectTypeOf(stringified).toEqualTypeOf<"<number>">();
			});
		});
	});
}
