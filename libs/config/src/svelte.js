import { preprocessMeltUI, sequence } from "@melt-ui/pp";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { sveltePreprocess } from "svelte-preprocess";

/** @type {import("@sveltejs/vite-plugin-svelte").Options} */
export const CONFIG = {
	preprocess: sequence([
		// sveltePreprocess({
		// 	script: false,
		// }),
		// vitePreprocess({
		// 	style: false,
		// }),
		preprocessMeltUI(),
	]),
};

export default CONFIG;
