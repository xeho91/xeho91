<script context="module" lang="ts">
export const FRAME_SIZE = 6;
</script>

<script lang="ts" generics="TSquareSide extends number">
	import type { Square } from "@xeho91/lib-geometry/two-dimension/square";
	import dedent from "dedent";

	import { set_id } from "#meta";

	import { SHADOW_SIZE } from "../FeDropShadow.svelte";

	interface Props {
		id: string;
		dimensions: Square<TSquareSide>;
		shape: "circle" | "rect";
	}

	let { id, dimensions, shape }: Props = $props();
	const { size } = dimensions;
	// Circle
	const circle = dimensions.to_circle();
	const radius_outer = circle.radius - SHADOW_SIZE;
	const radius_inner = radius_outer - FRAME_SIZE;
	// // Rect
	// const [background_width, background_height] = [
	// 	width - SHADOW_SIZE - FRAME_SIZE * 2,
	// 	height - SHADOW_SIZE - FRAME_SIZE * 2,
	// ];
</script>

<symbol id={set_id(id, "frame")}>
	{#if shape === "circle"}
		<path
			d={dedent`
				M ${size - SHADOW_SIZE},${dimensions.half()} a ${radius_outer},${radius_outer} 0 1 0 0,0.001
				M ${size - SHADOW_SIZE - FRAME_SIZE},${dimensions.half()} a ${radius_inner},${radius_inner} 0 1 0 0 0.001
			`}
		/>
		<!-- {:else if shape === "rect"} -->
		<!-- 	<path -->
		<!-- 		d={dedent` -->
		<!-- 			M0 0h ${width} v${height} H0 z -->
		<!-- 			M${FRAME_SIZE} ${FRAME_SIZE} h${background_width} v${background_height} H${FRAME_SIZE} z -->
		<!-- 		`} -->
		<!-- 	/> -->
	{/if}
</symbol>
