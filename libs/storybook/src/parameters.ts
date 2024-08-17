import { readonly_object } from "@xeho91/lib-snippet/object";
import type { Parameters } from "storybook/internal/types";

export const PARAMETERS = readonly_object({
	default: {
		controls: { disable: true },
	},
	playground: {
		controls: { disable: false },
	},
	sample: {
		controls: { disable: true },
	},
	variants: {
		controls: { disable: true },
		actions: { disable: true },
		layout: "padded",
	},
} satisfies Record<string, Parameters>);
