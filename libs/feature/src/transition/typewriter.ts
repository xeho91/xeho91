import type { TransitionConfig } from "svelte/transition";

interface TypewriterOptions {
	delay?: TransitionConfig["delay"];
	speed?: number;
}

export function typewriter(element: Element, options: TypewriterOptions = {}): TransitionConfig {
	const { delay = 0, speed = 1 } = options;
	const child_node: Text | undefined = [...element.childNodes].find(
		(n) => n.nodeType === Node.TEXT_NODE && n instanceof Text,
	) as Text | undefined;
	if (!child_node) throw new TypeError("This transition only works on elements with a single text node child");
	const text = child_node.wholeText;
	const duration = text.length / (speed * 0.01);
	return {
		duration,
		delay,
		tick: (t) => {
			const index = Math.trunc(text.length * t);
			element.textContent = text.slice(0, index);
		},
	};
}
