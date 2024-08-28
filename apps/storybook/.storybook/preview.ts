/* FIXME: Temporary workaround, to ensure the order stays as intended. */
import "./global.css";

import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Decorator, Parameters } from "@storybook/svelte";

import GlobalDecorator from "./GlobalDecorator.svelte";

export const decorators: Decorator[] = [
	withThemeByDataAttribute({
		attributeName: "data-color-scheme",
		defaultTheme: "system",
		themes: {
			light: "light",
			system: "system",
			dark: "dark",
		},
	}),
	() => ({ Component: GlobalDecorator }),
];

export const parameters: Parameters = {
	options: {
		showPanel: false,
		storySort: {
			order: [
				"design token",
				"brand",
				"primitive",
				"semantic",
				"layout",
				"atom",
				"molecule",
				"organism",
				"template",
				"page",
			],
		},
	},
};
