import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import { not_found } from "@xeho91/lib-error/not_found";
import type { ListrContext, ListrTask } from "listr2";
import * as v from "valibot";

import { DesignColor } from "#color";
import { Elevation } from "#elevation";
import { FontFamily } from "#font/family";
import { FontSize } from "#font/size";
import { FontWeight } from "#font/weight";
import { Grid } from "#grid";
import { DesignRadius } from "#radius";
import { Space } from "#space";
import { Stroke } from "#stroke";

export const CONFIG_FLUID_SCHEMA = v.object({
	font_size: v.object({
		min: v.number(),
		max: v.number(),
	}),
	type_scale: v.object({
		min: v.number(),
		max: v.number(),
	}),
	steps: v.object({
		positive: v.pipe(v.number(), v.integer()),
		negative: v.pipe(v.number(), v.integer()),
	}),
});

export const CONFIG_COLOR_SCHEMA = v.object({
	brand: v.object(
		//
		v.entriesFromList(
			[...DesignColor.brand],
			v.object(v.entriesFromList([...DesignColor.TYPES], DesignColor.SCHEMA)),
		),
	),
	semantic: v.object(
		v.entriesFromList(
			[...DesignColor.semantic],
			v.object(v.entriesFromList([...DesignColor.TYPES], DesignColor.SCHEMA)),
		),
	),
	grayscale: v.object(
		v.entriesFromList(
			[...DesignColor.grayscale],
			v.object(v.entriesFromList([...DesignColor.TYPES], DesignColor.SCHEMA)),
		),
	),
});

export const CONFIG_ELEVATION_SCHEMA = v.record(v.pipe(v.string(), v.regex(/[0-9]/)), v.array(Elevation.LAYER_SCHEMA));

export const CONFIG_FONT_SCHEMA = v.object({
	family: v.record(v.string(), FontFamily.SCHEMA),
	weight: v.record(v.string(), v.array(FontWeight.SCHEMA)),
	size: v.record(v.string(), FontSize.SCHEMA),
});

export const CONFIG_SCHEMA = v.object(
	{
		fluid: CONFIG_FLUID_SCHEMA,
		color: CONFIG_COLOR_SCHEMA,
		elevation: CONFIG_ELEVATION_SCHEMA,
		font: CONFIG_FONT_SCHEMA,
		grid: v.record(v.string(), Grid.SCHEMA),
		radius: v.record(v.string(), DesignRadius.SCHEMA),
		space: v.record(v.string(), Space.SCHEMA),
		stroke: v.record(v.string(), Stroke.SCHEMA),
	},
	"Invalid design config",
);
export type DesignConfig = v.InferInput<typeof CONFIG_SCHEMA>;

export function defineConfig(config: DesignConfig): DesignConfig {
	return config;
}

export const load_config = <TContext extends ListrContext>(
	file_path: string,
): ListrTask<
	TContext & {
		config: string | DesignConfig;
	}
> => {
	const absolute_file_path = path.join(process.cwd(), file_path);
	if (!fs.existsSync(absolute_file_path)) throw not_found(absolute_file_path);
	const absolute_file_path_url = url.pathToFileURL(absolute_file_path);
	return {
		title: `Read & validate config from: ${absolute_file_path_url}`,
		task: async (context) => {
			const module = await import(absolute_file_path_url.href);
			context.config = v.parse(CONFIG_SCHEMA, module.default);
		},
	};
};
