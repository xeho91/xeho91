import { SelectorClass } from "@xeho91/lib-css/selector/class";
import { clsx } from "clsx";
import type { Action } from "svelte/action";

export function merge_classes(...args: (Parameters<typeof clsx>[0] | SelectorClass)[]) {
	return clsx(args.map((t) => (t instanceof SelectorClass ? t.name : t)));
}

type ClassInput = Parameters<typeof clsx>[0] | SelectorClass;

export const classes: Action<Element, (ClassInput | ClassInput[])[]> = (node, classes) => {
	// biome-ignore lint/style/useConst: Readability: It's mutating
	let tokens: string[] = [];
	if (Array.isArray(classes)) {
		for (const selector_or_class of classes) {
			if (selector_or_class instanceof SelectorClass) tokens.push(selector_or_class.name);
			else if (selector_or_class) {
				const names = clsx(selector_or_class).split(" ");
				tokens.push(...names);
			}
		}
	} else if (classes) tokens.push(classes.toString());
	node.classList.add(...tokens);
	return {
		destroy() {
			node.classList.remove(...tokens);
		},
	};
};

export interface WithClass {
	class?: Parameters<typeof merge_classes>[0];
}
