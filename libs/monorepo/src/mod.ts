import path from "node:path";
import url from "node:url";

import { unreachable } from "@xeho91/lib-error/unreachable";
import { log } from "@xeho91/lib-logger";
import { findUp, pathExists } from "find-up";

import { is_absolute_path } from "#util";

/**
 * A file which will determine that the directory is a workspace root.
 */
const FILENAME_TO_FIND = "pnpm-workspace.yaml";

/**
 * Find the workspace root based on the existence
 * of a file specified in {@link FILENAME_TO_FIND}.
 *
 * @throws When the directory cannot be determined.
 */
export async function get_workspace_root_path_url() {
	log.trace(`Attempting to determine the workspace root path based on the filename: "${FILENAME_TO_FIND}"...`);
	const directory_path = await findUp(determine_path, { type: "directory" });

	if (directory_path && is_absolute_path(directory_path)) {
		const directory_path_url = url.pathToFileURL(directory_path);
		log.debug(`Workspace root: ${directory_path_url}`);

		return directory_path_url;
	}

	throw new Error(
		`Couldn't determine the workspace ROOT absolute path based on the filename to find: "${FILENAME_TO_FIND}"!`,
	);
}

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;

	describe(`${get_workspace_root_path_url.name}()`, () => {
		it("successfully returns the workspace root absolute path URL", async ({ expect }) => {
			const pathURL = await get_workspace_root_path_url();

			expect(pathURL).toBeInstanceOf(URL);
			// biome-ignore lint/complexity/useLiteralKeys: Conflicting with TS config
			expect(pathURL.pathname.startsWith(process.env["HOME"] as string)).toBe(true);
			expect(pathURL.pathname.endsWith("/xeho91")).toBe(true);
		});
	});
}

/**
 * A callback to run in {@link findUp}
 * @param directory - Directory path which is being determined
 */
async function determine_path(directory: string): ReturnType<typeof findUp> {
	if (!is_absolute_path(directory)) {
		throw unreachable("The provided directory path is not absolute.");
	}

	const path_attempt = path.join(directory, FILENAME_TO_FIND);
	const path_has_file = await pathExists(path_attempt);

	if (path_has_file) {
		return directory;
	}

	log.trace({ directory }, "This is NOT the workspace ROOT");
}
