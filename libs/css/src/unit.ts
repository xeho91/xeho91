import "@xeho91/lib-type/reset";
import { unreachable } from "@xeho91/lib-error/unreachable";
import { unrecognized } from "@xeho91/lib-error/unrecognized";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";

import { Syntax, type SyntaxName, type SyntaxUnits } from "#syntax";

export class Unit<TName extends UnitName = UnitName> implements Display {
	#name: TName;

	constructor(name: TName) {
		this.#name = name;
	}

	/**
	 * @throws {import("@xeho91/lib-error/unreachable").UnreachableError} when no syntax has current unit
	 */
	public get syntax(): Syntax<SyntaxNameFromUnitName<TName>> {
		for (const [syntax_name, set] of Object.entries(Syntax.UNITS)) {
			if (set?.has(this.#name)) return new Syntax(syntax_name as SyntaxNameFromUnitName<TName>);
		}
		throw unreachable();
	}

	public get name(): TName {
		return this.#name;
	}

	/**
	 * @throws {import("@xeho91/lib-error/unrecognized").UnrecognizedError} when attempting to set name which doesn't match initially set syntax
	 */
	public set name(name: SyntaxUnits<SyntaxNameFromUnitName<TName>>) {
		// @ts-expect-error FIXME: Couldn't figure out why instantiation didn't work
		if (this.syntax.units.has(name)) this.#name = name as TName;
		else throw unrecognized(`This unit doesn't match the syntax ${this.syntax.name}`);
	}

	public toString(): TName {
		return this.#name;
	}
}

type MappedSyntaxUnits = {
	[TKey in SyntaxName]: SyntaxUnits<TKey>;
};
export type UnitName = NonNullable<MappedSyntaxUnits[SyntaxName]>;

type FindSyntax<TUnit extends UnitName> = {
	[TKey in SyntaxName]: TUnit extends IterableElement<(typeof Syntax.UNITS)[TKey]> ? TKey : never;
};
type FindSyntaxValues<TUnit extends UnitName> = FindSyntax<TUnit>[keyof FindSyntax<TUnit>];
type SyntaxNameFromUnitName<TUnit extends UnitName> = FindSyntaxValues<TUnit> extends never
	? never
	: FindSyntaxValues<TUnit>;

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(Unit.name, () => {
		describe("constructor", () => {
			it("iterates correctly over the static readonly set of names", ({ expect }) => {
				expect(new Unit("px")).toBeInstanceOf(Unit);
			});
		});

		describe("get syntax", () => {
			it("returns a valid syntax name", ({ expect }) => {
				const { syntax } = new Unit("px");
				expect(syntax).toBeInstanceOf(Syntax);
				expect(syntax.valueOf()).toBe("length");
				expectTypeOf(syntax).toEqualTypeOf<Syntax<"length">>();
				expectTypeOf(syntax.name).toEqualTypeOf<"length">();
			});
		});

		describe("set name", () => {
			it("works when trying to set a new unit from ininitially set syntax", ({ expect }) => {
				const unit = new Unit("px");
				unit.name = "vw";
				expect(unit.name).toBe("vw");
			});

			it("throws when trying to set a new unit from different syntax", ({ expect }) => {
				const unit = new Unit("px");
				expect(() => {
					// @ts-expect-error Testing
					unit.name = "%";
				}).toThrowErrorMatchingInlineSnapshot(
					`[UnrecognizedError: An unrecognized case { "This unit doesn't match the syntax length" } has occurred!]`,
				);
			});
		});
	});
}
