<script lang="ts">
import { Grid } from "@xeho91/lib-design/grid";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { onDestroy, onMount } from "svelte";

import { Container } from "#primitive/container/mod";

interface Props extends WithChildren, WithClass {}

let { children, class: class_ }: Props = $props();

let is_mounted = $state(false);

onMount(() => {
	is_mounted = true;
});
onDestroy(() => {
	is_mounted = false;
});
</script>

<Container
	name="layout"
	type="inline-size"
	box="grid"
	width="full"
	class={merge_classes(
		"layout-default",
		"justify-self-center",
		Grid.min.get("default").class("min-width"),
		Grid.max.get("default").class("max-width"),
		"grid-cols-12 auto-cols-fr",
		Grid.gutter.get("default").class("gap"),
		class_,
	)}
>
	{#if is_mounted}
		{@render children()}
	{/if}
</Container>

<style>
	@layer component {
		:global(body:has(.layout-default)) {
			padding-inline: var(--grid-gutter-default);
		}
	}
</style>
