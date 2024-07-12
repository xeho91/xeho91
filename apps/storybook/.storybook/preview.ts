import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Decorator } from "@storybook/svelte";

export const decorators: Decorator[] = [
	withThemeByDataAttribute({
		themes: {
			light: "light",
			dark: "dark",
		},
		defaultTheme: "light",
		attributeName: "data-color-scheme",
	}),
];
