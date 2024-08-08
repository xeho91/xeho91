import type { Display } from "@xeho91/lib-type/trait/display";

import { SelectorBase } from "#selector/base";

export class SelectorUniversal extends SelectorBase<"universal"> implements Display<Stringified> {
	public readonly value = "*" as const;

	constructor() {
		super("universal");
	}

	public toString(): Stringified {
		return this.value;
	}
}

type Stringified = SelectorUniversal["value"];

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(SelectorUniversal.name, () => {
		describe(SelectorUniversal.name, () => {
			it("toString()", ({ expect }) => {
				const stringified = new SelectorUniversal().toString();
				expect(stringified).toBe("*");
				expectTypeOf(stringified).toEqualTypeOf<"*">();
			});
		});
	});
}
