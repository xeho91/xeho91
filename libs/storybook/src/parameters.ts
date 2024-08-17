import type { Parameters } from "@storybook/types";
import { readonly_object } from "@xeho91/lib-snippet/object";

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
		// docs: {
		// 	source: {
		// 		rawCode: null,
		// 	},
		// },
		layout: "padded",
	},
} satisfies Record<string, Parameters>);
