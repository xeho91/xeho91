import path from "node:path";
import url from "node:url";

import adapter from "@sveltejs/adapter-static";
import { CONFIG as SHARED_CONFIG } from "@xeho91/lib-config/svelte";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("@sveltejs/kit").Config} */
const CONFIG = {
	...SHARED_CONFIG,
	kit: {
		adapter: adapter({
			fallback: "200.html",
		}),
		alias: {
			"$lib/*": "src/lib/*",
		},
		files: {
			// TODO: Use lib-monorepo once transformed to JSDoc
			assets: path.resolve(__dirname, "..", "..", "libs", "asset", "src"),
			lib: path.resolve(__dirname, "src", "lib"),
		},
		prerender: {
			handleHttpError: "warn",
		},
	},
};

export default CONFIG;
