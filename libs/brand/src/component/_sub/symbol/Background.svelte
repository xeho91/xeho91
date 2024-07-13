<script lang="ts" generics="TWidth extends number, THeight extends number">
import type { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";

import type { BrandAssetTheme } from "#design";
import { set_id } from "#meta";

import { SHADOW_BLUR, SHADOW_OFFSET_X, SHADOW_OFFSET_Y, SHADOW_SIZE } from "../FeDropShadow.svelte";

interface Props {
	id: string;
	dimensions: Rectangle<TWidth, THeight>;
	theme: BrandAssetTheme;
	shape?: "circle" | "rectangle";
}

let { id, dimensions, theme, shape }: Props = $props();

const r = dimensions.half("width") - SHADOW_SIZE * 2;
const [width, height] = [
	dimensions.width - SHADOW_OFFSET_X - SHADOW_BLUR,
	dimensions.height - SHADOW_OFFSET_Y - SHADOW_BLUR,
];
const cx = dimensions.half("width");
const cy = dimensions.half("height");
</script>

<symbol
	id={set_id(id, "background")}
	style:--light={theme.light_background.oklch.toString()}
	style:--dark={theme.dark_background.oklch.toString()}
	style:transition-property="fill"
	style:transition-duration="200ms"
	style:transition-timing-function="ease-in-out"
	style:fill="light-dark(var(--light), var(--dark))"
>
	{#if shape === "circle"}
		<circle {cx} {cy} {r} />
	{:else if shape === "rectangle"}
		<rect {width} {height} />
	{/if}
</symbol>
