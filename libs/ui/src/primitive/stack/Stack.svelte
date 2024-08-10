<script lang="ts" generics="TTag extends StackHtmlTag = 'div'">
import { Space, type SpaceSize } from "@xeho91/lib-design/space";
import { merge_classes } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { StackDirection, StackHtmlTag } from "./util";

interface Props extends HTMLAttributes<HTMLElementTagNameMap[TTag]> {
	tag?: TTag;
	children: Snippet;
	// Flex
	direction?: StackDirection;
	align_items?: "center" | "start" | "end" | "baseline" | "stretch" | undefined;
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
	// Margins
	margin?: SpaceSize | undefined;
	margin_x?: SpaceSize | undefined;
	margin_x_start?: SpaceSize | undefined;
	margin_x_end?: SpaceSize | undefined;
	margin_y?: SpaceSize | undefined;
	margin_y_start?: SpaceSize | undefined;
	margin_y_end?: SpaceSize | undefined;
}

let {
	tag = "div" as TTag,
	children,
	class: class_,
	// Flex
	direction = "row",
	align_items,
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
	// Margins
	margin,
	margin_x,
	margin_x_start,
	margin_x_end,
	margin_y,
	margin_y_start,
	margin_y_end,
	// Other
	...rest_props
}: Props = $props();
</script>

<svelte:element
	this={tag as string}
	class:flex-col={direction === "column"}
	class:flex-row={direction === "row"}
	class:items-center={align_items === "center"}
	class:items-start={align_items === "start"}
	class:items-end={align_items === "end"}
	class:items-stretch={align_items === "stretch"}
	class:items-baseline={align_items === "baseline"}
	class={merge_classes(
		"stack",
		"flex",
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
		// Margin
		margin && Space.get(margin).class("margin"),
		margin_x && Space.get(margin_x).class("margin-inline"),
		margin_x_start && Space.get(margin_x_start).class("margin-block-start"),
		margin_x_end && Space.get(margin_x_end).class("margin-block-end"),
		margin_y && Space.get(margin_y).class("margin-block"),
		margin_y_start && Space.get(margin_y_start).class("margin-block-start"),
		margin_y_end && Space.get(margin_y_end).class("margin-block-end"),
		// Other
		class_,
	)}
	{...rest_props}
>
	{@render children()}
</svelte:element>
