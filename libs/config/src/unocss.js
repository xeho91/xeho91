import { defineConfig, presetUno } from "unocss";
import extractorSvelte from "@unocss/extractor-svelte";

export const CONFIG = defineConfig({
	extractors: [
		//
		extractorSvelte(),
	],
	presets: [
		//
		presetUno(),
	],
	outputToCssLayers: {
		cssLayerName: (name) => `framework.${name}`,
	},
});

export default CONFIG;
