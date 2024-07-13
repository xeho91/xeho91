import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { log } from "@xeho91/lib-logger";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
	log.info("Running svelte-package...");
	child_process.spawnSync("svelte-package", ["--input", "src/", "--types"]);

	const output_dir = path.join(__dirname, "..", "dist");
	const svelte_dts_files = fs.readdirSync(output_dir, { withFileTypes: true, recursive: true }).filter((dirent) => {
		const { name, parentPath } = dirent;
		return parentPath.includes("dist/component") && /^[A-Z].*\.d\.ts$/.test(name);
	});

	for (const dirent of svelte_dts_files) {
		const { name, parentPath } = dirent;
		const src = path.join(parentPath, name);
		const dest = path.join(parentPath.replace("dist", "src"), name);
		log.info(`Copying: ${url.pathToFileURL(src)}\nto: ${url.pathToFileURL(dest)}`);
		fs.copyFileSync(src, dest);
	}

	log.info("Cleaning dist directory");
	fs.rmdirSync(output_dir, { recursive: true });

	log.info("Finished!");
}

await main();
