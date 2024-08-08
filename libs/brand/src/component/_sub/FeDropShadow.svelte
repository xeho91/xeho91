<script context="module" lang="ts">
export const SHADOW_OFFSET_X = 1;
export const SHADOW_OFFSET_Y = 1;
export const SHADOW_BLUR = 1.5;
export const SHADOW_SIZE = SHADOW_OFFSET_X + SHADOW_OFFSET_Y + SHADOW_BLUR;
</script>

<script lang="ts">
	import { Color } from "@xeho91/lib-color";
	import type { AtomicColor } from "@xeho91/lib-color/atomic";

	import { set_id } from "#id";

	interface Props {
		id: string;
		color?: AtomicColor;
		offset_x?: number;
		offset_y?: number;
		blur?: number;
	}

	let {
		id,
		color = Color.get("grayscale", "gray", "blend", 9).dark,
		offset_x = SHADOW_OFFSET_X,
		offset_y = SHADOW_OFFSET_Y,
		blur = SHADOW_BLUR,
	}: Props = $props();
</script>

<filter id={set_id(id, "shadow")} filterUnits="userSpaceOnUse">
	<feDropShadow
		dx={offset_x}
		dy={offset_y}
		stdDeviation={blur}
		flood-color={color.toString()}
		flood-opacity={color.oklch.alpha.toString()}
	/>
</filter>
