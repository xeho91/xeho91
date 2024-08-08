import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import type { PropertiesHyphen } from "csstype";

import { Reference } from "#reference";

export type PropertyName = keyof PropertiesHyphen & {};

type AllowedValue = Reference | PropertyName | (string & {});

export class Property<TName extends AllowedValue = AllowedValue> implements Display<Stringified<TName>> {
	readonly #name: TName;

	constructor(name: TName) {
		this.#name = name;
	}

	public get name(): GetPropertyName<TName> {
		if (this.#name instanceof Reference) return this.#name.name as GetPropertyName<TName>;
		return this.#name as GetPropertyName<TName>;
	}

	public toString(): Stringified<TName> {
		return `${this.#name}` as Stringified<TName>;
	}
}

type GetPropertyName<TName extends AllowedValue> = TName extends Reference ? TName["name"] : TName;

type Stringified<Name extends AllowedValue> = Name extends Reference ? ToString<Name> : Name;

export interface ToProperty {
	name: string;
	to_property(): Property;
}

export type InferProperty<T extends ToProperty> = ReturnType<T["to_property"]>;

export type InferPropertyName<T extends Property | ToProperty | undefined> = T extends ToProperty
	? T["name"]
	: T extends Property<infer TValue extends AllowedValue>
		? GetPropertyName<TValue>
		: never;

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(Property.name, () => {
		describe("toString()", () => {
			it("for stored string as property it returns itself", ({ expect }) => {
				const name = "background-color";
				const instance = new Property(name);
				const stringified = instance.toString();
				expect(stringified).toBe(name);
				expectTypeOf(stringified).toEqualTypeOf<typeof name>();
			});

			it("for stored CSS Reference it returns stringified", ({ expect }) => {
				const name = "app-bg";
				const instance = new Property(new Reference(name));
				const stringified = instance.toString();
				expect(stringified).toBe(`--${name}`);
				expectTypeOf(stringified).toEqualTypeOf<`--${typeof name}`>();
			});
		});
	});
}
