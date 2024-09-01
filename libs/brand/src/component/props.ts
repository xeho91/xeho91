import type { WithAnchor, WithClass } from "@xeho91/lib-feature/css";
import { create_control_from_boolean, create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import type { ComponentProps } from "svelte";

import type SVG from "./_sub/SVG.svelte";

import { BrandAssetTheme, type BrandAssetThemeName } from "#design";

export const DEFAULT_ANIMATED = false;
export const DEFAULT_BACKGROUNDED = false;

export interface SharedProps extends WithAnchor, WithClass {
	/**
	 * Color **theme** for the foreground _(logomark and frame)_
	 */
	theme?: BrandAssetThemeName;
	/**
	 * Enable foreground color animation _(works on {@link theme}="color" only)_
	 */
	animated?: boolean;
	/**
	 * Enable background - it will automatically match set {@link theme}
	 */
	backgrounded?: boolean;
	/**
	 * Bind to the `<svg>` element of this asset
	 */
	svg?: ComponentProps<SVG>["svg"];
}

export const SHARED_ARG_TYPES = {
	theme: create_control_from_iterable(BrandAssetTheme, {
		category: "design",
	}),
	animated: create_control_from_boolean(DEFAULT_ANIMATED, {
		category: "options",
	}),
	backgrounded: create_control_from_boolean(DEFAULT_BACKGROUNDED, {
		category: "design",
	}),
} as const;
