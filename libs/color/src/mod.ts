import type { ColorCategory, ColorName } from "#instance";
import type { ColorPalette } from "#palette";
import { PALETTE_ACCENT } from "#palette/brand/accent";
import { PALETTE_PRIMARY } from "#palette/brand/primary";
import { PALETTE_SECONDARY } from "#palette/brand/secondary";
import { PALETTE_BLACK } from "#palette/grayscale/black";
import { PALETTE_GRAY } from "#palette/grayscale/gray";
import { PALETTE_WHITE } from "#palette/grayscale/white";
import { PALETTE_ERROR } from "#palette/semantic/error";
import { PALETTE_INFO } from "#palette/semantic/info";
import { PALETTE_SUCCESS } from "#palette/semantic/success";
import { PALETTE_WARNING } from "#palette/semantic/warning";

export const COLOR = Object.freeze({
	brand: {
		primary: PALETTE_PRIMARY,
		secondary: PALETTE_SECONDARY,
		accent: PALETTE_ACCENT,
	},
	semantic: {
		error: PALETTE_ERROR,
		info: PALETTE_INFO,
		success: PALETTE_SUCCESS,
		warning: PALETTE_WARNING,
	},
	grayscale: {
		black: PALETTE_BLACK,
		gray: PALETTE_GRAY,
		white: PALETTE_WHITE,
	},
} as const satisfies Record<ColorCategory, Partial<Record<ColorName, ColorPalette>>>);
