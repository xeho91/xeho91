<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { merge_classes } from "@xeho91/lib-feature/css";

import Container from "./Container.svelte";
import Footer from "./Footer.svelte";
import Header from "./Header.svelte";
import Main from "./Main.svelte";

import { LAYOUT_DEFAULT_GRID_GUTTER } from "./util";

interface Props extends WithChildren {}

let { children }: Props = $props();

let rendered = $state(false);

$effect(() => {
	rendered = true;
});
</script>

<svelte:head>
	{#each Color.SCHEMES as scheme}
		<meta
			name="theme-color"
			content={Color.get("secondary", "solid", 9).light_dark[scheme].oklch.toString()}
			media={`(prefers-color-scheme: ${scheme})`}
		/>
	{/each}
</svelte:head>

<Container>
	{#if rendered}
		<Header
			class={merge_classes(
				LAYOUT_DEFAULT_GRID_GUTTER.class("scroll-margin-block-start"),
				"col-span-full row-start-1"
			)}
		/>
		<Main
			class={merge_classes(
				//
				"col-span-full row-start-2"
			)}
		>
			{@render children()}
		</Main>
		<Footer
			class={merge_classes(
				//
				"col-span-full row-start-3"
			)}
		/>
	{/if}
</Container>

<style>
@layer component {
	:global(body:has(.layout-default)) {
		padding-inline: var(--grid-gutter-default);
	}
}
</style>
