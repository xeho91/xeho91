<script lang="ts">
import { Grid } from "@xeho91/lib-design/grid";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";

import { LAYOUT_DEFAULT_GRID_GUTTER } from "./util";

import { Container } from "#primitive/container/mod";

interface Props extends WithChildren, WithClass {}

let { children, class: class_ }: Props = $props();
</script>

<Container
	name="layout"
	type= "inline-size"
	grid
	class={merge_classes(
		"layout-default",
		"justify-self-center",
		Grid.min.get("default").class("min-width"),
		"w-full",
		Grid.max.get("default").class("max-width"),
		"grid-cols-12 auto-cols-fr",
		LAYOUT_DEFAULT_GRID_GUTTER.class("gap"),
		class_,
	)}
>
	{@render children()}
</Container>

<style>
@layer component {
	:global(body:has(.layout-default)) {
		padding-inline: var(--grid-gutter-default);
	}
}
</style>
