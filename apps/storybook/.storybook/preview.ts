import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Decorator, Parameters } from "@storybook/svelte";

/*  FIXME: Temporary workaround, to ensure the order stays as intended. */
import "./global.css";
import { GlobalManagers } from "@xeho91/lib-feature/global";

export const decorators: Decorator[] = [
	withThemeByDataAttribute({
		themes: {
			light: "light",
			dark: "dark",
		},
		defaultTheme: "light",
		attributeName: "data-color-scheme",
	}),
	() => ({ Component: GlobalManagers }),
];

export const parameters: Parameters = {
	options: { showPanel: true },
};
