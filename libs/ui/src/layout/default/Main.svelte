<script lang="ts">
import { Reference } from "@xeho91/lib-css/reference";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { fade } from "svelte/transition";

import { LAYOUT_DEFAULT_FADE, LAYOUT_DEFAULT_GRID_GUTTER, LAYOUT_DEFAULT_HEADER_MAIN_HEIGHT_REFERENCE } from "./util";

interface Props extends WithChildren<[boolean]>, WithClass {}

let {
	//
	class: class_,
	children,
}: Props = $props();

let rendered = $state(false);

$effect(() => {
	rendered = true;
});

const min_height = `calc(100lvh - ${LAYOUT_DEFAULT_HEADER_MAIN_HEIGHT_REFERENCE.to_var()} - (2 * ${LAYOUT_DEFAULT_GRID_GUTTER.reference.to_var()}))`;
const reference = new Reference("layout-default-main-min-height");
</script>

<main
	style:--layout-default-main-min-height={min_height}
	style:min-height={reference.to_var().toString()}
	class={merge_classes(
		"grid",
		class_,
	)}
	transition:fade={{...LAYOUT_DEFAULT_FADE, delay: 250 }}
>
	{#if rendered}
		{@render children(rendered)}
	{/if}
</main>

<style>
@layer component {
	main {
		grid-template-columns: subgrid;
	}
}
</style>
