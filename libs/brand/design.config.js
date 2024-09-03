import { defineConfig } from "@xeho91/lib-design/cli";

export default defineConfig({
	fluid: {
		font_size: {
			min: 18,
			max: 20,
		},
		type_scale: {
			min: 1.2,
			max: 1.25,
		},
		steps: {
			positive: 6,
			negative: 2,
		},
	},

	color: {
		brand: {
			accent: {
				opaque: { light: "orange", dark: "orangeDark" },
				blend: { light: "orangeA", dark: "orangeDarkA" },
			},
			primary: {
				opaque: { light: "purple", dark: "purpleDark" },
				blend: { light: "purpleA", dark: "purpleDarkA" },
			},
			secondary: {
				opaque: { light: "plum", dark: "plumDark" },
				blend: { light: "plumA", dark: "plumDarkA" },
			},
		},
		semantic: {
			error: {
				opaque: { light: "tomato", dark: "tomatoDark" },
				blend: { light: "tomatoA", dark: "tomatoDarkA" },
			},
			info: {
				opaque: { light: "sky", dark: "skyDark" },
				blend: { light: "skyA", dark: "skyDarkA" },
			},
			success: {
				opaque: { light: "lime", dark: "limeDark" },
				blend: { light: "limeA", dark: "limeDarkA" },
			},
			warning: {
				opaque: { light: "amber", dark: "amberDark" },
				blend: { light: "amberA", dark: "amberDarkA" },
			},
		},
		grayscale: {
			black: {
				opaque: { light: "black", dark: "white" },
				blend: { light: "blackA", dark: "whiteA" },
			},
			gray: {
				opaque: { light: "sand", dark: "sandDark" },
				blend: { light: "sandA", dark: "sandDarkA" },
			},
			white: {
				opaque: { light: "white", dark: "black" },
				blend: { light: "whiteA", dark: "blackA" },
			},
		},
	},

	elevation: {
		0: [
			{ x: 0, y: 0, blur: 0, spread: 0, alpha: 0 },
			{ x: 0, y: 0, blur: 0, spread: 0, alpha: 0 },
			{ x: 0, y: 0, blur: 0, spread: 0, alpha: 0 },
		],
		1: [
			{ x: 0, y: 1, blur: 1, spread: -0.5, alpha: 65 },
			{ x: 0, y: 2, blur: 2, spread: -1, alpha: 70 },
			{ x: 0, y: 4, blur: 4, spread: -2, alpha: 75 },
		],
		2: [
			{ x: 0, y: 2, blur: 2, spread: -1, alpha: 62.5 },
			{ x: 0, y: 4, blur: 4, spread: -2, alpha: 67.5 },
			{ x: 0, y: 8, blur: 8, spread: -4, alpha: 72.5 },
		],
		3: [
			{ x: 0, y: 4, blur: 4, spread: -2, alpha: 60 },
			{ x: 0, y: 8, blur: 8, spread: -4, alpha: 65 },
			{ x: 0, y: 16, blur: 16, spread: -8, alpha: 70 },
		],
		4: [
			{ x: 0, y: 8, blur: 8, spread: -4, alpha: 57.5 },
			{ x: 0, y: 16, blur: 16, spread: -8, alpha: 62.5 },
			{ x: 0, y: 24, blur: 24, spread: -12, alpha: 67.5 },
		],
		5: [
			{ x: 0, y: 16, blur: 16, spread: -8, alpha: 55 },
			{ x: 0, y: 24, blur: 24, spread: -12, alpha: 60 },
			{ x: 0, y: 32, blur: 32, spread: -18, alpha: 65 },
		],
	},

	font: {
		family: {
			mono: "JetBrains Mono Variable",
			sans: "Work Sans Variable",
			serif: "Fraunces Variable",
		},
		weight: {
			mono: ["regular", "bold"],
			sans: ["light", "medium", "bold", "black"],
			serif: ["light", "medium", "bold", "black"],
		},
		size: {
			"5xl": { min: 53.75, max: 76.29 },
			"4xl": { min: 44.79, max: 61.04 },
			"3xl": { min: 37.32, max: 48.83 },
			"2xl": { min: 31.1, max: 39.06 },
			xl: { min: 25.92, max: 31.25 },
			l: { min: 21.6, max: 25.0 },
			m: { min: 18.0, max: 20.0 },
			s: { min: 15.0, max: 16.0 },
		},
	},

	grid: {
		default: {
			column: 12,
			min: 330,
			max: 1240,
		},
	},

	radius: {
		xs: 1,
		s: 2,
		m: 4,
		l: 8,
		xl: 12,
		circle: 9999,
	},

	space: {
		"3xs": { min: 4, max: 5 },
		"2xs": { min: 8, max: 10 },
		xs: { min: 14, max: 15 },
		s: { min: 18, max: 20 },
		m: { min: 27, max: 30 },
		l: { min: 36, max: 40 },
		xl: { min: 54, max: 60 },
		"2xl": { min: 72, max: 80 },
		"3xl": { min: 108, max: 120 },
	},

	stroke: {
		xs: 1,
		s: 2,
		m: 4,
		l: 8,
		xl: 12,
	},
});
