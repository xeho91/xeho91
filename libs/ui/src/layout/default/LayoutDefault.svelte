<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import { Grid } from "@xeho91/lib-design/grid";
import { Space } from "@xeho91/lib-design/space";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { merge_classes } from "@xeho91/lib-feature/css";
import { type Snippet, onDestroy, onMount, tick } from "svelte";

import Container from "./Container.svelte";
import Footer from "./Footer.svelte";
import Header from "./Header.svelte";
import Main from "./Main.svelte";

interface Props extends WithChildren {
	nav: Snippet<[string]>;
}

let { children, nav }: Props = $props();

let is_mounted = $state(false);

onMount(async () => {
	await tick();
	is_mounted = true;
});
onDestroy(async () => {
	is_mounted = false;
	await tick();
});
</script>

<svelte:head>
	{#each Color.SCHEMES as scheme}
		<meta
			name="theme-color"
			content={Color.get("secondary", "opaque", 9)[
				scheme
			].oklch.toString()}
			media={`(prefers-color-scheme: ${scheme})`}
		/>
	{/each}
</svelte:head>

<Container>
	{#if is_mounted}
		{@const gutter = Grid.gutter.get("default")}
		<Header
			class={merge_classes(
				gutter.class("margin-block-start"),
				gutter.class("scroll-margin-block-start"),
				"row-start-1",
			)}
		/>
		{@render nav(merge_classes(
			"z-10 row-start-3",
			"sticky",
		))}
		<Main
			class={merge_classes(
				"row-start-2"
			)}
		>
			{@render children()}
		</Main>
		<Footer
			class={merge_classes("row-start-4")}
		/>
	{/if}
</Container>

<style>
	@layer component {
		:global(body:has(.layout-default)) {
			padding-inline: var(--grid-gutter-default);
		}
	}

	:global(.sb-show-main.sb-main-fullscreen) {
		display: revert-layer;
		padding: revert-layer;
	}

	@layer override {
		:global(#storybook-root) {
			display: contents;
		}
	}
</style>
