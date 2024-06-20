import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { unreachable } from "@xeho91/lib-error/unreachable";
import { log } from "@xeho91/lib-logger";

import { WORKSPACE_LIBS } from "#lib.gen";
import { get_workspace_root_path_url } from "#mod";

export const LIBS_DIRNAME = "libs";

export { WORKSPACE_LIBS } from "#lib.gen";
/** @see {@link WORKSPACE_LIBS} */
export type WorkspaceLib = (typeof WORKSPACE_LIBS)[number];

/**
 * Get the **absolute path URL** to the project's workspace targeted _library_ package root directory.
 * @param name - workspace library package to target
 */
export async function get_lib_root_path_url<T extends WorkspaceLib>(name: T): Promise<URL> {
	const workspace_root_url = await get_workspace_root_path_url();
	const package_root_url = url.pathToFileURL(path.join(workspace_root_url.pathname, LIBS_DIRNAME, name));

	if (fs.existsSync(package_root_url.pathname)) {
		log.debug(`Absolute path of the package directory: ${package_root_url}`);
		return package_root_url;
	}

	throw unreachable(`Couldn't determine the absolute path for the package - "${name}" - root directory!`);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(`${get_lib_root_path_url.name}(WorkspaceLib)`, () => {
		for (const name of WORKSPACE_LIBS) {
			it(`succeeds for the library package name ("${name}")`, async ({ expect }) => {
				const path_url = await get_lib_root_path_url(name);

				expect(path_url).toBeInstanceOf(URL);
				// biome-ignore lint/complexity/useLiteralKeys: Conflicting with TS config
				expect(path_url.pathname.startsWith(process.env["HOME"] as string)).toBe(true);
				expect(path_url.pathname.endsWith(`${LIBS_DIRNAME}/${name}`)).toBe(true);
			});
		}
	});
}
