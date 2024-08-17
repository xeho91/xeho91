import { Space } from "@xeho91/lib-design/space";
import type { FadeParams } from "svelte/transition";

export const LAYOUT_DEFAULT_SPACE_INLINE = Space.get("s");
export const LAYOUT_DEFAULT_FADE = { duration: 250 } as const satisfies FadeParams;
