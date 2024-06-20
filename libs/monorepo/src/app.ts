import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { unreachable } from "@xeho91/lib-error/unreachable";
import { log } from "@xeho91/lib-logger";

import { WORKSPACE_APPS } from "#app.gen";
import { get_workspace_root_path_url } from "#mod";

export const APPS_DIRNAME = "apps";

export { WORKSPACE_APPS } from "#app.gen";
/** @see {@link WORKSPACE_APPS} */
export type WorkspaceApp = (typeof WORKSPACE_APPS)[number];

/**
 * Get the **absolute path URL** to the project workspace targeted _app_ root directory.
 * @param name - workspace app to target
 */
export async function get_app_root_path_url<T extends WorkspaceApp>(name: T): Promise<URL> {
	const workspace_root_url = await get_workspace_root_path_url();
	const package_root_url = url.pathToFileURL(path.join(workspace_root_url.pathname, APPS_DIRNAME, name));

	if (fs.existsSync(package_root_url.pathname)) {
		log.debug(`Absolute path of the package directory: ${package_root_url}`);
		return package_root_url;
	}

	throw unreachable(`Couldn't determine the absolute path for the app - "${name}" - root directory!`);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(`${get_app_root_path_url.name}(WorkspaceApp)`, () => {
		for (const name of WORKSPACE_APPS) {
			it(`succeeds for the app name ("${name}")`, async ({ expect }) => {
				const pathURL = await get_app_root_path_url(name);

				expect(pathURL).toBeInstanceOf(URL);
				// biome-ignore lint/complexity/useLiteralKeys: Conflicting with TS config
				expect(pathURL.pathname.startsWith(process.env["HOME"] as string)).toBe(true);
				expect(pathURL.pathname.endsWith(`${APPS_DIRNAME}/${name}`)).toBe(true);
			});
		}
	});
}
