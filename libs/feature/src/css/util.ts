import { SelectorClass } from "@xeho91/lib-css/selector/class";
import { type ClassValue, clsx } from "clsx";
import type { Action } from "svelte/action";

export function merge_classes(...args: (Parameters<typeof clsx>[0] | SelectorClass)[]): string {
	let results = "";
	for (const input of args) {
		if (results) results += " ";
		if (input instanceof SelectorClass) results += input.name;
		else results += clsx(input);
	}
	return results;
}

type ClassInput = ClassValue | SelectorClass;

export const classes: Action<Element, ClassInput[]> = (node, ...classes) => {
	// biome-ignore lint/style/useConst: Readability: It's mutating
	let tokens: string[] = [];
	for (const selector_or_class of classes) {
		if (selector_or_class instanceof SelectorClass) tokens.push(selector_or_class.name);
		else if (selector_or_class) {
			const names = clsx(selector_or_class).split(" ");
			tokens.push(...names);
		}
		node.classList.add(...tokens);
		return {
			destroy() {
				node.classList.remove(...tokens);
			},
		};
	}
};

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(merge_classes.name, () => {
		it("accepts SelectorClass and stringifies them", ({ expect }) => {
			const classes = merge_classes(new SelectorClass("round-xl"), new SelectorClass("flex"));
			expect(classes).toBe("round-xl flex");
		});
	});
}

export interface WithClass {
	class?: Parameters<typeof merge_classes>[0];
}
