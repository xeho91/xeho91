import { Reference } from "@xeho91/lib-css/reference";
import { Grid } from "@xeho91/lib-design/grid";
import type { FadeParams } from "svelte/transition";

export const LAYOUT_DEFAULT_FADE = { duration: 250 } as const satisfies FadeParams;

export const LAYOUT_DEFAULT_GRID_GUTTER = Grid.gutter.get("default");
export const LAYOUT_DEFAULT_HEADER_MAIN_HEIGHT_REFERENCE = new Reference("header-main-height");
export const LAYOUT_DEFAULT_MAIN_MIN_HEIGHT = new Reference("layout-default-main-min-height");
