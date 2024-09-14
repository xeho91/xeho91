import { Reference } from "@xeho91/lib-css/reference";
import type { FadeParams } from "svelte/transition";

export const LAYOUT_DEFAULT_FADE = { duration: 250 } as const satisfies FadeParams;

export const LAYOUT_DEFAULT_HEADER_MAIN_HEIGHT_REFERENCE = new Reference("header-main-height");
export const LAYOUT_DEFAULT_NAV_APP_HEIGHT_REFERENCE = new Reference("nav-app-height");
export const LAYOUT_DEFAULT_MAIN_MIN_HEIGHT = new Reference("layout-default-main-min-height");
