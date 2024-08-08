import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

import * as radix from "@radix-ui/colors";
import { log } from "@xeho91/lib-logger";
import { round_up } from "@xeho91/lib-snippet/number";
import { object_entries } from "@xeho91/lib-snippet/object";
import type { Entries } from "@xeho91/lib-type/iterable";
import { parse } from "culori";
import { modeOklch, parseHex, useMode } from "culori/fn";
import handlebars from "handlebars";

import type { ColorCategory, ColorName, ColorScheme, ColorStep, ColorType } from "#mod";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOOK_NAME = "prepare";
const OUTPUT_DIR_PALETTE = path.resolve(__dirname, "..", "src", "palette");
const TEMPLATE = await fs.readFile(path.resolve(__dirname, HOOK_NAME, "template.ts.hbs")).then((b) => b.toString());

const white = Object.fromEntries(Array.from({ length: 12 }, (_, idx) => [idx + 1, "#ffffff"]));
const black = Object.fromEntries(Array.from({ length: 12 }, (_, idx) => [idx + 1, "#000000"]));

const COLORS = {
	brand: {
		primary: {
			solid: { light: radix.purple, dark: radix.purpleDark },
			blend: { light: radix.purpleA, dark: radix.purpleDarkA },
		},
		secondary: {
			solid: { light: radix.plum, dark: radix.plumDark },
			blend: { light: radix.plumA, dark: radix.plumDarkA },
		},
		accent: {
			solid: { light: radix.orange, dark: radix.orangeDark },
			blend: { light: radix.orangeA, dark: radix.orangeDarkA },
		},
	},
	semantic: {
		error: {
			solid: { light: radix.tomato, dark: radix.tomatoDark },
			blend: { light: radix.tomatoA, dark: radix.tomatoDarkA },
		},
		info: {
			solid: { light: radix.sky, dark: radix.skyDark },
			blend: { light: radix.skyA, dark: radix.skyDarkA },
		},
		success: {
			solid: { light: radix.lime, dark: radix.limeDark },
			blend: { light: radix.limeA, dark: radix.limeDarkA },
		},
		warning: {
			solid: { light: radix.amber, dark: radix.amberDark },
			blend: { light: radix.amberA, dark: radix.amberDarkA },
		},
	},
	grayscale: {
		black: {
			solid: { light: black, dark: white },
			blend: { light: radix.blackA, dark: radix.whiteA },
		},
		gray: {
			solid: { light: radix.sand, dark: radix.sandDark },
			blend: { light: radix.sandA, dark: radix.sandDarkA },
		},
		white: {
			solid: { light: white, dark: black },
			blend: { light: radix.blackA, dark: radix.whiteA },
		},
	},
} as const;

async function prepare() {
	log.info("Starting hook prepare...");

	const promises = object_entries(COLORS).flatMap(create_write_file_promise);

	await Promise.all(promises);

	log.info("Finished hook prepare!");
}

await prepare();

type ColorsEntry = Entries<typeof COLORS>[number];

function create_write_file_promise(entry: ColorsEntry) {
	const [color_category, category] = entry;
	const category_dir_path = path.join(OUTPUT_DIR_PALETTE, color_category);

	return object_entries(category).map((entry) => {
		const [color_name, color_data] = entry;
		const file_name = `${color_name}.ts`;
		const file_path = path.join(category_dir_path, file_name);
		const variables = create_variables({
			color_category,
			color_name,
			color_data,
		}).join("\n");
		const compiled_template = handlebars.compile(TEMPLATE, { noEscape: true })({
			color_category,
			color_name,
			variables,
			// palette: create_palette_var(color_name),
		});

		log.info(`Generated: ${url.pathToFileURL(file_path)}`);
		return fs.writeFile(file_path, compiled_template);
	});
}

type ColorData = ReturnType<typeof object_entries<ColorsEntry[1]>>[number][1];

function create_variables({
	color_name,
	color_data,
}: {
	color_category: ColorCategory;
	color_name: ColorName;
	color_data: ColorData;
}): string[] {
	return object_entries(color_data).flatMap((entry) => {
		const [color_type, color_type_data] = entry;

		return object_entries(color_type_data).flatMap((entry) => {
			const [color_scheme, hexes] = entry;
			const new_oklchs = Object.values(hexes).map((hex_or_rgb) =>
				create_color_oklch_var({ color_name, hex_or_rgb }),
			);

			return new_oklchs.map((new_oklch, idx) =>
				create_color_var({
					color_name,
					color_scheme,
					color_type,
					color_step: (idx + 1) as ColorStep,
					oklch_props: new_oklch,
				}),
			);
		});
	});
}

function create_color_oklch_var({ color_name, hex_or_rgb }: { color_name: ColorName; hex_or_rgb: string }): string {
	const oklch = useMode(modeOklch);

	let parsed_oklch: ReturnType<typeof oklch>;

	if (hex_or_rgb.startsWith("#")) {
		parsed_oklch = oklch(parseHex(hex_or_rgb));
	} else {
		parsed_oklch = oklch(parse(hex_or_rgb));
	}

	if (!parsed_oklch) {
		log.fatal(`Failed to convert color - ${color_name} - HEX value to OKLCH`);
		process.exit(1);
	}

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

function create_color_var({
	color_name,
	color_type,
	color_scheme,
	color_step,
	oklch_props,
}: {
	color_name: ColorName;
	color_type: ColorType;
	color_scheme: ColorScheme;
	color_step: ColorStep;
	oklch_props: string;
}): string {
	const identifier = create_identifier({ color_name, color_type, color_scheme, color_step });
	return `
		export const ${identifier} = new AtomicColor({
			category,
			name,
			scheme: "${color_scheme}",
			type: "${color_type}",
			step: ${color_step},
			oklch: ${oklch_props}
		});
	`;
}

function create_identifier({
	color_name,
	color_type,
	color_scheme,
	color_step,
}: {
	color_name: ColorName;
	color_type: ColorType;
	color_scheme: ColorScheme;
	color_step: ColorStep;
}) {
	return `${color_name.toUpperCase()}_${color_type.toUpperCase()}_${color_step}_${color_scheme.toUpperCase()}`;
}
