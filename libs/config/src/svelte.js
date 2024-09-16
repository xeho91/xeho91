import { preprocessMeltUI, sequence } from "@melt-ui/pp";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import("@sveltejs/vite-plugin-svelte").Options} */
export const CONFIG = {
	preprocess: sequence([
		vitePreprocess({
			style: false,
		}),
		preprocessMeltUI(),
	]),
};

export default CONFIG;
