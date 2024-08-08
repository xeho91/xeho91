import { generate } from "css-tree";
import { bench, describe } from "vitest";

import { Identifier } from "#identifier";
import { Value } from "#value";

describe("benchmark", () => {
	bench("toString()", () => {
		const _1_item = new Identifier("transparent");
		const _2_item = new Identifier("red");
		new Value(_1_item, _2_item).toString();
	});
	bench("to_ast() + css-tree.generate()", () => {
		const _1_item = new Identifier("transparent");
		const _2_item = new Identifier("red");
		const node = new Value(_1_item, _2_item).to_ast();
		generate(node);
	});
});
