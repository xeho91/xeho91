import extractorSvelte from "@unocss/extractor-svelte";
import { defineConfig, presetUno } from "unocss";

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
