<script lang="ts">
import { Grid, type GridVariant } from "@xeho91/lib-design/grid";
import { Space, type SpaceSize } from "@xeho91/lib-design/space";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css/util";
import type { Snippet } from "svelte";

interface Props extends WithClass {
	children: Snippet;
	// Grid
	grid?: GridVariant;
	min_width?: boolean;
	max_width?: boolean;
	// Gaps
	gap?: SpaceSize | undefined;
	gap_column?: SpaceSize | undefined;
	gap_row?: SpaceSize | undefined;
	// Paddings
	padding?: SpaceSize | undefined;
	padding_x?: SpaceSize | undefined;
	padding_x_start?: SpaceSize | undefined;
	padding_x_end?: SpaceSize | undefined;
	padding_y?: SpaceSize | undefined;
	padding_y_start?: SpaceSize | undefined;
	padding_y_end?: SpaceSize | undefined;
}

let {
	//
	children,
	class: class_,
	// Grid
	grid = "default",
	min_width = false,
	max_width = false,
	// Gaps
	gap,
	gap_column,
	gap_row,
	// Paddings
	padding,
	padding_x,
	padding_x_start,
	padding_x_end,
	padding_y,
	padding_y_start,
	padding_y_end,
}: Props = $props();
</script>

	<div
		class={merge_classes(
			//
			"container",
			"relative",
			// Gap
			gap && Space.get(gap).class("gap"),
			gap_column && Space.get(gap_column).class("column-gap"),
			gap_row && Space.get(gap_row).class("row-gap"),
			// Padding
			padding && Space.get(padding).class("padding"),
			padding_x && Space.get(padding_x).class("padding-inline"),
			padding_x_start && Space.get(padding_x_start).class("padding-inline-start"),
			padding_x_end && Space.get(padding_x_end).class("padding-inline-end"),
			padding_y && Space.get(padding_y).class("padding-block"),
			padding_y_start && Space.get(padding_y_start).class("padding-block-start"),
			padding_y_end && Space.get(padding_y_end).class("padding-inline-end"),
			"grid",
			min_width && Grid.min.get(grid).class("min-width"),
			max_width && Grid.max.get(grid).class("max-width"),
			class_,
		)}
	>
		{@render children()}
</div>
