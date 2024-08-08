import type { UtopiaTypeConfig } from "utopia-core";

/**
 * Configuration for the Utopia Fluid calculator.
 * @see {@link https://utopia.fyi}
 */
export const FLUID_CONFIG = {
	minWidth: 330,
	maxWidth: 1240,
	minFontSize: 18,
	maxFontSize: 20,
	minTypeScale: 1.2,
	maxTypeScale: 1.25,
	positiveSteps: 6,
	negativeSteps: 2,
	relativeTo: "container",
} as const satisfies UtopiaTypeConfig;

export type FluidClamp = `clamp(${number}rem, ${number}rem + ${number}cqi, ${number}rem)`;
