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
	layers: {
		reset: -1,
		base: 0,
		framework: 5,
	},
	outputToCssLayers: {
		cssLayerName: (name) => `framework.${name}`,
	},
});

export default CONFIG;
