<script lang="ts">
import { Grid, type GridVariant } from "@xeho91/lib-design/grid";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css/util";
import type { Snippet } from "svelte";

interface Props extends WithClass {
	children: Snippet;
	grid?: GridVariant;
}

let {
	//
	children,
	class: class_,
	grid = "default",
}: Props = $props();
</script>

	<div
		class={merge_classes(
			//
			"container",
			"grid",
			Grid.max.get(grid).class("max-width"),
			class_,
		)}
	>
		{@render children()}
</div>
