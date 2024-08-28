/* FIXME: Temporary workaround, to ensure the order stays as intended. */
import "./global.css";

import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Decorator, Parameters } from "@storybook/svelte";

import GlobalDecorator from "./GlobalDecorator.svelte";

export const decorators: Decorator[] = [
	withThemeByDataAttribute({
		themes: {
			light: "light",
			system: "system",
			dark: "dark",
		},
		defaultTheme: "system",
		attributeName: "data-color-scheme",
	}),
	() => ({ Component: GlobalDecorator }),
];

export const parameters: Parameters = {
	options: { showPanel: false },
};
