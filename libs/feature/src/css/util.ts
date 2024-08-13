import { SelectorClass } from "@xeho91/lib-css/selector/class";
import { type ClassValue, clsx } from "clsx";
import type { Action } from "svelte/action";

type ClassInput = ClassValue | SelectorClass;

/**
 * Merge multiple selector class names into one string separated by spaces.
 * It allows using conditions (powered by `clsx`).
 * Also, accepts {@link SelectorClass}.
 */
export function merge_classes(...args: ClassInput[]): string {
	let results = "";
	for (const input of args) {
		if (results) results += " ";
		if (input instanceof SelectorClass) results += input.name;
		else results += clsx(input);
	}
	return results;
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(merge_classes.name, () => {
		it("accepts SelectorClass and stringifies them", ({ expect }) => {
			const classes = merge_classes(new SelectorClass("round-xl"), new SelectorClass("flex"));
			expect(classes).toBe("round-xl flex");
		});
	});
}

export const classes: Action<Element, Array<ClassInput | ClassInput[]>> = (node, ...classes) => {
	// biome-ignore lint/style/useConst: Readability: It's mutating
	let tokens: string[] = [];
	for (const selector_or_class of classes.flat()) {
		if (selector_or_class instanceof SelectorClass) tokens.push(selector_or_class.name);
		else if (selector_or_class) {
			const names = clsx(selector_or_class).split(" ");
			tokens.push(...names);
		}
		node.classList.add(...tokens);
	}
	return {
		destroy() {
			node.classList.remove(...tokens);
		},
	};
};

export interface WithClass {
	class?: ReturnType<typeof merge_classes>;
}
