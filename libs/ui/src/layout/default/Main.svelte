<script lang="ts">
import { Reference } from "@xeho91/lib-css/reference";
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { NumberCSS } from "@xeho91/lib-css/value/number";
import { Grid } from "@xeho91/lib-design/grid";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { onDestroy, onMount, tick } from "svelte";
import { fade } from "svelte/transition";

import { Space } from "@xeho91/lib-design/space";
import {
	LAYOUT_DEFAULT_FADE,
	LAYOUT_DEFAULT_HEADER_MAIN_HEIGHT_REFERENCE,
	LAYOUT_DEFAULT_NAV_APP_HEIGHT_REFERENCE,
} from "./util";

interface Props extends WithChildren<[boolean]>, WithClass {}

let {
	//
	class: class_,
	children,
}: Props = $props();

let is_mounted = $state(false);

const var_header = LAYOUT_DEFAULT_HEADER_MAIN_HEIGHT_REFERENCE.to_var(new Dimension(0, "lvh").to_value());
const var_gutter = Grid.gutter.get("default").reference.to_var(new NumberCSS(0).to_value());
const min_height = `calc(100lvh - ${var_header} - (2 * ${var_gutter}))`;
const reference = new Reference("layout-default-main-min-height");

onMount(async () => {
	await tick();
	is_mounted = true;
});
onDestroy(async () => {
	is_mounted = false;
	await tick();
});
</script>

<main
	style:--layout-default-main-min-height={min_height}
	style:--first-section-margin-block-end={`calc(${LAYOUT_DEFAULT_NAV_APP_HEIGHT_REFERENCE.to_var()} + ${var_gutter} - ${Space.get("2xs").var})`}
	style:min-height={reference.to_var().toString()}
	class={merge_classes(
		"grid col-span-full grid-cols-subgrid",
		class_,
	)}
	in:fade={{...LAYOUT_DEFAULT_FADE, delay: 250 }}
>
	{#if is_mounted}
		{@render children(is_mounted)}
	{/if}
</main>

<style>
@layer component {
	:root::view-transition-old(main),
	:root::view-transition-new(main) {
		animation-duration: var(--transition-dur);
		animation-timing-function: var(--transition-fn);
		animation-fill-mode: both;
	}
	:root::view-transition-new(main) {
		animation-duration: var(--transition-dur);
		animation-timing-function: var(--transition-fn);
		animation-fill-mode: both;
	}
	:root:has(main.left)::view-transition-old(main) {
		animation-name: slide-to-left;
	}
	:root:has(main.left)::view-transition-new(main) {
		animation-name: slide-from-right;
	}
	:root:has(main.right)::view-transition-old(main) {
		animation-name: slide-to-right;
	}
	:root:has(main.right)::view-transition-new(main) {
		animation-name: slide-from-left;
	}

	main {
		view-transition-name: main;

		animation-duration: var(--transition-dur);
		animation-timing-function: var(--transition-fn);
		animation-fill-mode: both;

		:global(section:first-of-type) {
			margin-block-end: var(--first-section-margin-block-end);
		}
	}

	@keyframes slide-to-left {
		to {
			opacity: 0;
			translate: -33vw;
		}
	}
	@keyframes slide-to-right {
		to {
			opacity: 0;
			translate: 33vw;
		}
	}
	@keyframes slide-from-left {
		from {
			opacity: 0;
			translate: -33vw;
		}
	}
	@keyframes slide-from-right {
		from {
			opacity: 0;
			translate: 33vw;
		}
	}
}
</style>
