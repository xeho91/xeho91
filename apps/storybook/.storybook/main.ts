// NOTE: Only CJS is supported

import path from "node:path";

import type { StorybookConfig } from "@storybook/svelte-vite";

/** @see {@link https://storybook.js.org/docs/configure/typescript#configure-storybook-with-typescript} */
const config: StorybookConfig = {
	addons: [
		// "@chromatic-com/storybook",
		"@storybook/addon-essentials",
		"@storybook/addon-svelte-csf",
		"@storybook/addon-themes",
	],
	docs: {
		autodocs: true,
	},
	framework: {
		name: "@storybook/svelte-vite",
		options: {},
	},
	stories: [
		{
			directory: path.resolve(__dirname, "..", "..", "..", "libs", "brand", "src"),
			files: "**/*.stories.svelte",
		},
	],
	typescript: {},
	viteFinal: async (config, _options) => {
		const { svelte } = await import("@sveltejs/vite-plugin-svelte");
		const { plugins, ...rest } = config;
		return {
			...rest,
			plugins: [...(plugins ?? []), svelte()],
		};
	},
};

export default config;
