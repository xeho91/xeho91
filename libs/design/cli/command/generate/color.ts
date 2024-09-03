import fs from "node:fs";
import fs_promises from "node:fs/promises";
import path from "node:path";
import url from "node:url";

import * as radix_color from "@radix-ui/colors";
import { unimplemented } from "@xeho91/lib-error/unimplemented";
import { unreachable } from "@xeho91/lib-error/unreachable";
import { round_up } from "@xeho91/lib-snippet/number";
import { parse } from "culori";
import { modeOklch, parseHex, useMode } from "culori/fn";
import handlebars from "handlebars";
import type { ListrTask } from "listr2";

import type { GenerateContext } from "#cli/command/generate/mod";
import {
	DesignColor,
	type ColorCategory,
	type ColorName,
	type ColorScheme,
	type ColorStep,
	type ColorType,
} from "#color";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE = await fs_promises
	.readFile(path.resolve(__dirname, "template", "color-variables.ts.hbs"))
	.then((b) => b.toString());

export const generate_color_variables = (): ListrTask<GenerateContext> => {
	return {
		title: "Generate color variables modules",
		task: async (_context, task) => {
			return task.newListr([...DesignColor.CATEGORIES].map(generate_category_colors_variables), {
				// nested listr options
				concurrent: true,
			});
		},
		rendererOptions: {
			persistentOutput: true,
		},
	};
};

const generate_category_colors_variables = (category: ColorCategory): ListrTask<GenerateContext> => ({
	title: category,
	task: async (context, task) => {
		context.category = category;
		return task.newListr(
			[...DesignColor[category]].map((name) => create_color_variables_module(category, name)),
			{ concurrent: true },
		);
	},
	rendererOptions: {
		persistentOutput: true,
	},
});

const create_color_variables_module = (category: ColorCategory, name: ColorName): ListrTask<GenerateContext> => ({
	title: name,
	task: async (context, task) => {
		const directory_path = path.join(context.cwd, context.output, "color", category);
		if (!fs.existsSync(directory_path)) await fs_promises.mkdir(directory_path, { recursive: true });
		const file_path = path.join(directory_path, `${name}.ts`);
		const variables = create_variables({ context, category, name });
		const compiled_template = handlebars.compile(TEMPLATE, { noEscape: true })({
			category,
			name,
			variables,
		});
		await fs_promises.writeFile(file_path, compiled_template, { encoding: "utf-8" });
		task.title += `: ${url.pathToFileURL(file_path)}`;
	},
	rendererOptions: {
		persistentOutput: true,
	},
});

interface CreateVaiablesParameters {
	context: GenerateContext;
	category: ColorCategory;
	name: ColorName;
}
function create_variables(parameters: CreateVaiablesParameters): string {
	// biome-ignore lint/style/useConst: Readability - mutation
	let variables: string[] = [];
	const { context, category, name } = parameters;
	const { config } = context;
	if (typeof config === "string") throw unreachable();
	for (const type of DesignColor.TYPES) {
		for (const scheme of DesignColor.SCHEMES) {
			// @ts-expect-error: NOTE: Too lazy to type it
			let radix_color_variable = radix_color[config.color[category][name][type][scheme]];
			if (!radix_color_variable) radix_color_variable = get_alternative_color(name);
			for (const step of DesignColor.STEPS) {
				variables.push(
					create_atomic_color({
						name,
						type,
						scheme,
						step,
						oklch: create_color_oklch_object({
							name,
							hex_or_rgb: Object.values(radix_color_variable)[step - 1] as string,
						}),
					}),
				);
			}
		}
	}
	return variables.join("\n");
}

interface CreateAtomicColorParameters {
	name: ColorName;
	type: ColorType;
	scheme: ColorScheme;
	step: ColorStep;
	oklch: string;
}
function create_atomic_color(parameters: CreateAtomicColorParameters): string {
	const identifier = create_identifier(parameters);
	const { type, scheme, step, oklch } = parameters;
	return `
		export const ${identifier} = new AtomicColor({
			category,
			name,
			scheme: "${scheme}",
			type: "${type}",
			step: ${step},
			oklch: ${oklch}
		});
	`;
}

function get_alternative_color(name: ColorName) {
	// biome-ignore format: Prettier
	switch (name) {
		case "black": return Object.fromEntries(
			Array.from({ length: 12 },
				(_, index) => [index + 1, "#000000"]),
		);
		case "white": return Object.fromEntries(
			Array.from({ length: 12 },
				(_, index) => [index + 1, "#ffffff"])
		);
		default: throw unimplemented(name);
	}
}

interface CreateColorOklchObjectParameters {
	name: ColorName;
	hex_or_rgb: string;
}
function create_color_oklch_object(parameters: CreateColorOklchObjectParameters): string {
	const { name, hex_or_rgb } = parameters;
	const oklch = useMode(modeOklch);
	let parsed_oklch: ReturnType<typeof oklch>;
	if (hex_or_rgb.startsWith("#")) parsed_oklch = oklch(parseHex(hex_or_rgb));
	else parsed_oklch = oklch(parse(hex_or_rgb));
	if (!parsed_oklch) throw unreachable(`Failed to convert color - ${name} - HEX value to OKLCH`);
	const l = round_up(parsed_oklch.l * 100);
	const c = round_up((parsed_oklch.c * 100) / 0.4);
	const h = round_up(parsed_oklch.h ?? 0);
	const a = round_up(parsed_oklch.alpha ? parsed_oklch.alpha * 100 : 100);
	return `{
		lightness: new Percentage(${l}),
		chroma: new Percentage(${c}),
		hue: new Dimension(${h}, "deg"),
		alpha: new Percentage(${a}),
	}`;
}

interface CreateIdentifierParameters {
	name: ColorName;
	type: ColorType;
	scheme: ColorScheme;
	step: ColorStep;
}
function create_identifier(parameters: CreateIdentifierParameters): string {
	const { name, type, scheme, step } = parameters;
	return `${name.toUpperCase()}_${type.toUpperCase()}_${step}_${scheme.toUpperCase()}`;
}
