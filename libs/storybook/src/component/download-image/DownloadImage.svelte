<script context="module">
export * from "./manager.svelte";
</script>

<script lang="ts" generics="TWidth extends number = number, THeight extends number = number">
import type { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";
import { Square } from "@xeho91/lib-geometry/two-dimension/square";
import type { Snippet } from "svelte";

import { DownloadImageManager, type ImageFormat } from "./manager.svelte";

interface Props {
	children: Snippet;
	dimensions: Rectangle<TWidth, THeight> | Square<TWidth>;
	svg: SVGElement | undefined;
	format?: ImageFormat;
	scale?: number;
}

let { children, dimensions = $bindable(), svg = $bindable(), format = $bindable("svg"), scale = 1 }: Props = $props();

let manager = $derived(new DownloadImageManager({ dimensions, svg, format, scale }));
let width = $derived(dimensions instanceof Square ? dimensions.size : dimensions.width);
let height = $derived(dimensions instanceof Square ? dimensions.size : dimensions.height);
</script>

<div class="asset" style:width={width + "px"} style:height={height + "px"}>
	{@render children()}
</div>

<div class="download">
	<p>Dimensions: {dimensions}</p>
	<p>Use the <strong>DOWNLOAD</strong> tabs in the control pane</p>

	<button onclick={() => manager.handle_click()}>
		{`Download *.${format.toUpperCase()} file`}
	</button>
</div>

<style>
	/* TODO: Update styles */
	.asset {
		border-style: dotted;
		border-width: 1px;
		border-color: black;
	}

	.download {
		position: fixed;
		top: 1em;
		left: 1em;

		display: flex;
		flex-direction: column;
		column-gap: 1rem;
	}
</style>
