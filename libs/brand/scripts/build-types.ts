import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { log } from "@xeho91/lib-logger";
import dedent from "dedent";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build_types() {
	log.info("Starting script `build:types`...");

	log.info("Running svelte-package to build types...");
	// NOTE: Reference: https://github.com/sveltejs/kit/tree/main/packages/package
	child_process.spawnSync("svelte-package", ["--input", "src/", "--types"]);

	const output_dir = path.join(__dirname, "..", "dist");
	const svelte_dts_files = fs.readdirSync(output_dir, { withFileTypes: true, recursive: true }).filter((dirent) => {
		const { name, parentPath } = dirent;
		const regex = /^[A-Z].*(?<!\.stories)\.svelte\.d\.ts$/;
		return parentPath.includes("dist/component") && !parentPath.includes("_sub") && regex.test(name);
	});

	for (const dirent of svelte_dts_files) {
		const { name, parentPath } = dirent;
		const src = path.join(parentPath, name);
		const dest_dir = parentPath.replace("dist", "src");
		if (!fs.existsSync(dest_dir)) fs.mkdirSync(dest_dir, { recursive: true });
		const dest = path.join(dest_dir, name);
		log.info(`Copying: ${url.pathToFileURL(src)}\nto: ${url.pathToFileURL(dest)}`);
		fs.copyFileSync(src, dest);

		const comment = dedent(`
			/**
			 * WARN: **Do not edit!**
             *
			 * This directory is automatically generated with script \`build:types\`.
			 */
		`);
		const original_data = fs.readFileSync(dest);
		fs.writeFileSync(dest, `${comment}\n\n${original_data}`);
	}

	log.info("Cleaning dist directory");
	fs.rmSync(output_dir, { recursive: true });

	log.info("Finished script `build:types`!");
}

await build_types();
