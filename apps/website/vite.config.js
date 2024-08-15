import { sveltekit } from "@sveltejs/kit/vite";
import unoCSS from "unocss/vite";
import { defineConfig } from "vitest/config";

const config = defineConfig({
	build: {
		rollupOptions: {
			treeshake: "smallest",
		},
	},
	define: {
		"import.meta.vitest": "undefined",
	},
	plugins: [sveltekit(), unoCSS()],
});

export default config;
