import path from "node:path";
import url from "node:url";

import { loadEnv } from "vite";
import { type UserWorkspaceConfig, defineWorkspace } from "vitest/config";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { WORKSPACE_LIBS } from "@xeho91/lib-monorepo/lib";

const SHARED_LIB = {
	env: Object.assign(process.env, loadEnv("", path.resolve(__dirname), "")),
	include: ["src/**/*.test.ts"],
	includeSource: ["src/**/*.ts"],
	typecheck: {
		enabled: true,
	},
} as const satisfies UserWorkspaceConfig["test"];

/** @see {@link https://vitest.dev/guide/workspace} */
const config = defineWorkspace([
	// Libraries
	...WORKSPACE_LIBS.map((lib_name) => {
		return {
			test: {
				...SHARED_LIB,
				root: path.resolve(__dirname, "libs", lib_name),
				name: `@xeho91/lib-${lib_name}`,
			},
		} satisfies UserWorkspaceConfig;
	}),
]);

export default config;
