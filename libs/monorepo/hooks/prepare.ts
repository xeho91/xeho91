import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { log } from "@xeho91/lib-logger";
import handlebars from "handlebars";

import { get_workspace_root_path_url } from "#mod";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(__dirname, "..", "src");
const OUTPUT_EXT = ".gen.ts";

async function prebuild() {
	const workspace_root_url = await get_workspace_root_path_url();

	const [app_names, lib_names] = await Promise.all([
		get_dir_names(workspace_root_url, "apps"),
		get_dir_names(workspace_root_url, "libs"),
	]);

	compile_template("app", app_names);
	compile_template("lib", lib_names);
}

await prebuild();

function compile_template(target: string, names: string[]): void {
	const template = fs.readFileSync(path.resolve(__dirname, "templates", `${target}.ts.hbs`), {
		encoding: "utf8",
	});
	const compiled = handlebars.compile(template, { noEscape: true })({
		names: format_names(names),
	});
	const output_path = path.resolve(SOURCE_DIR, `${target}${OUTPUT_EXT}`);

	fs.writeFileSync(output_path, compiled, { encoding: "utf8" });
	log.debug(`[prebuild]: Automatically generated ${target}s names at: ${url.pathToFileURL(output_path)}`);
}

function format_names(names: string[]): string {
	const formatted = names.map((name) => `"${name}",`).join("\n\t");

	return `\t${formatted}`;
}

async function get_dir_names(workspace_root_url: URL, dirname: string) {
	const dir_path = path.resolve(workspace_root_url.pathname, dirname);

	if (!fs.existsSync(dir_path)) {
		throw new Error(`Directory not found: ${dir_path}`);
	}

	return fs
		.readdirSync(dir_path, {
			withFileTypes: true,
		})
		.filter((path) => path.isDirectory())
		.map((dir) => dir.name);
}
