import type { Meta } from "@storybook/svelte";
import { readonly_object } from "@xeho91/lib-snippet/object";

export const SHARED_META = readonly_object({
	// FIXME: It breaks Storybook, need to ask Jeppe
	// excludeStories: ["Playground"],
} satisfies Meta);
