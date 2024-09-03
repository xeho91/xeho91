#!/usr/bin/env node --experimental-strip-types

import sade from "sade";

import pkg from "../package.json" with { type: "json" };

import { generate } from "#cli/command/generate/mod";

export { defineConfig } from "#cli/config";

const program = sade("design").version(pkg.version);

program
	.command("generate")
	.describe("Generate design token instances")
	.option("--cwd", "current working directory")
	.option("-c, --config", "path to config file", "./design.config.js")
	.option("-o, --output", "path to output directory", "./src/design/")
	.action(generate);

program.parse(process.argv, {
	// sade options
	unknown: (input) => `Unknown input: ${input}`,
});
