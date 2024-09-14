<script lang="ts" generics="TTag extends BoxHTMLTag = 'div'">
import { Space, type SpaceSize } from "@xeho91/lib-design/space";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { type WithAnchor, type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { noop } from "@xeho91/lib-snippet/function";
import type { Properties } from "csstype";
import type { HTMLAttributes } from "svelte/elements";
import type { TransitionConfig } from "svelte/transition";

import type { BoxHTMLTag } from "./util";

type Attributes = Omit<HTMLAttributes<HTMLElement>, "children" | "class">;
interface Props extends WithAnchor, WithChildren, WithClass, Attributes {
	tag?: TTag;
	element?: HTMLElement;
	border_box_size?: ResizeObserverSize[];
	// Layout
	align_content?: Properties["alignContent"];
	align_items?: Properties["alignItems"];
	justify_content?: Properties["justifyContent"];
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
	// Transitions
	in?: (node: Element) => TransitionConfig;
	out?: (node: Element) => TransitionConfig;
}

let {
	tag = "div" as TTag,
	element = $bindable(),
	border_box_size = $bindable(),
	children,
	class: class_,
	//
	anchor,
	anchor_name,
	// Layout
	align_content,
	align_items,
	justify_content,
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
	// Transitions
	in: in_ = noop,
	out = noop,
	...rest_props
}: Props = $props();
</script>

<svelte:element
	{...rest_props}
	this={tag}

	bind:this={element}
	bind:borderBoxSize={border_box_size}

	style:anchor-name={anchor_name?.toString()}
	style:position-anchor={anchor?.toString()}

	class:content-normal={align_content === "normal"}
	class:content-start={align_content === "start"}
	class:content-center={align_content === "center"}
	class:content-end={align_content === "end"}
	class:content-around={align_content === "space-around"}
	class:content-between={align_content === "space-between"}
	class:content-evenly={align_content === "space-evenly"}
	class:content-stretch={align_content === "stretch"}

	class:items-normal={align_items === "normal"}
	class:items-start={align_items === "start"}
	class:items-center={align_items === "center"}
	class:items-end={align_items === "end"}
	class:items-around={align_items === "space-around"}
	class:items-between={align_items === "space-between"}
	class:items-evenly={align_items === "space-evenly"}
	class:items-stretch={align_items === "stretch"}

	class:justify-normal={justify_content === "normal"}
	class:justify-start={justify_content === "start"}
	class:justify-center={justify_content === "center"}
	class:justify-end={justify_content === "end"}
	class:justify-around={justify_content === "space-around"}
	class:justify-between={justify_content === "space-between"}
	class:justify-evenly={justify_content === "space-evenly"}
	class:justify-stretch={justify_content === "stretch"}

	class={merge_classes(
		"box",
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
		// Margins
		margin && Space.get(margin).class("margin"),
		margin_x && Space.get(margin_x).class("margin-inline"),
		margin_x_start && Space.get(margin_x_start).class("margin-block-start"),
		margin_x_end && Space.get(margin_x_end).class("margin-block-end"),
		margin_y && Space.get(margin_y).class("margin-block"),
		margin_y_start && Space.get(margin_y_start).class("margin-block-start"),
		margin_y_end && Space.get(margin_y_end).class("margin-block-end"),
		class_,
	)}
	in:in_
	out:out
>
	{@render children()}
</svelte:element>
