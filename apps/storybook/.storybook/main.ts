// NOTE: Only CJS is supported

import path from "node:path";

import type { StorybookConfig } from "@storybook/svelte-vite";
import { get_app_root_path_url } from "@xeho91/lib-monorepo/app";
import { get_lib_root_path_url } from "@xeho91/lib-monorepo/lib";

/** @see {@link https://storybook.js.org/docs/configure/typescript#configure-storybook-with-typescript} */
const config = (async (): Promise<StorybookConfig> => {
	const [
		//
		app_storybook_url,
		lib_brand_url,
		lib_ui_url,
	] = await Promise.all([
		get_app_root_path_url("storybook"),
		get_lib_root_path_url("brand"),
		get_lib_root_path_url("ui"),
	]);

	return {
		addons: [
			"@chromatic-com/storybook",
			"@storybook/addon-essentials",
			"@storybook/addon-interactions",
			"@storybook/addon-svelte-csf",
			"@storybook/addon-themes",
		],
		docs: {
			autodocs: true,
		},
		framework: {
			name: "@storybook/sveltekit",
			options: {},
		},
		stories: [
			// Apps
			{
				directory: path.resolve(app_storybook_url.pathname, "stories"),
				files: "**/*.stories.svelte",
			},
			// Libraries
			{
				directory: path.resolve(lib_brand_url.pathname, "src"),
				files: "**/*.stories.svelte",
			},
			{
				directory: path.resolve(lib_ui_url.pathname, "src"),
				files: "**/*.stories.svelte",
			},
		],
		typescript: {},
		viteFinal: async (config, _options) => {
			const [{ svelte }, { default: uno_css }] = await Promise.all([
				import("@sveltejs/vite-plugin-svelte"),
				import("unocss/vite"),
			]);
			const { define, plugins, ...rest } = config;
			return {
				...rest,
				define: {
					...define,
					"import.meta.vitest": "undefined",
				},
				plugins: [
					//
					...(plugins ?? []),
					uno_css(),
					svelte(),
				],
			};
		},
	};
})();

export default config;
