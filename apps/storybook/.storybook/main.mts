// NOTE: Only CJS is supported

import path from "node:path";

import type { StorybookConfig } from "@storybook/svelte-vite";
import { get_lib_root_path_url } from "@xeho91/lib-monorepo/lib";

/** @see {@link https://storybook.js.org/docs/configure/typescript#configure-storybook-with-typescript} */
const config = (async (): Promise<StorybookConfig> => {
	// TODO: Add more libs
	const [lib_brand_url] = await Promise.all([get_lib_root_path_url("brand")]);

	return {
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
				directory: path.resolve(lib_brand_url.pathname, "src"),
				files: "**/*.stories.svelte",
			},
		],
		typescript: {},
		viteFinal: async (config, _options) => {
			const { svelte } = await import("@sveltejs/vite-plugin-svelte");
			const { define, plugins, ...rest } = config;
			return {
				...rest,
				define: {
					...define,
					"import.meta.vitest": "undefined",
				},
				plugins: [...(plugins ?? []), svelte()],
			};
		},
	};
})();

export default config;
