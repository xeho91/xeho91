<script lang="ts" generics="TTag extends BoxHTMLTag = 'div'">
import { Color } from "@xeho91/lib-design/color";
import { Elevation, type ElevationLevel } from "@xeho91/lib-design/elevation";
import { Radius, type RadiusSize } from "@xeho91/lib-design/radius";
import { Space, type SpaceSize } from "@xeho91/lib-design/space";
import { Stroke, type StrokeSize } from "@xeho91/lib-design/stroke";
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
	// Dimensions
	width?: "fit" | "full";
	height?: "fit" | "full";
	// Gaps
	gap?: SpaceSize;
	gap_column?: SpaceSize;
	gap_row?: SpaceSize;
	// Paddings
	padding?: SpaceSize;
	padding_x?: SpaceSize;
	padding_x_start?: SpaceSize;
	padding_x_end?: SpaceSize;
	padding_y?: SpaceSize;
	padding_y_start?: SpaceSize;
	padding_y_end?: SpaceSize;
	// Margins
	margin?: SpaceSize;
	margin_x?: SpaceSize;
	margin_x_start?: SpaceSize;
	margin_x_end?: SpaceSize;
	margin_y?: SpaceSize;
	margin_y_start?: SpaceSize;
	margin_y_end?: SpaceSize;
	// Border
	border?: Properties["borderStyle"];
	radius?: RadiusSize;
	stroke?: StrokeSize;
	// Design
	shadow?: ElevationLevel;
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
	style,
	//
	anchor,
	anchor_name,
	// Layout
	align_content,
	align_items,
	justify_content,
	// Dimensions
	width,
	height,
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
	// Border
	border,
	radius,
	stroke,
	// Design
	shadow,
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

	{style}

	style:anchor-name={anchor_name?.toString()}
	style:position-anchor={anchor?.toString()}

	class:w-fit={width === "fit"}
    class:w-full={width === "full"}
    class:h-fit={height === "fit"}
    class:h-full={height === "full"}

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

	class:border-solid={border === "solid"}
	class:border-dashed={border === "dashed"}

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
		// Border
		radius && Radius.get(radius).class(),
		stroke && Stroke.get(stroke).class(),
		// Design
		shadow && Elevation.class("box-shadow"),
		shadow && Elevation.get(shadow).class("box-shadow"),
		shadow && Color.class("box-shadow"),
		class_,
	)}
	in:in_|global
	out:out|global
>
	{@render children()}
</svelte:element>
