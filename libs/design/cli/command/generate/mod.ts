import { Listr, type ListrContext } from "listr2";
import type { Handler } from "sade";

import { load_config, type DesignConfig } from "#cli/config";
import { generate_color_variables } from "#cli/command/generate/color";

interface Options {
	cwd?: string;
	config: string;
	output: string;
}

export interface GenerateContext extends ListrContext {
	cwd: string;
	config: string | DesignConfig;
	output: string;
}

export const generate: Handler = async (options: Options) => {
	const tasks = new Listr<GenerateContext>(
		[
			//
			load_config<GenerateContext>(options.config),
			generate_color_variables(),
		],
		{
			rendererOptions: {
				clearOutput: false,
				collapseSubtasks: false,
			},
			// listr options
		},
	);
	try {
		await tasks.run({
			...options,
			cwd: options.cwd ?? process.cwd(),
		});
	} catch (error) {
		console.error(error);
	}
};
