<script context="module" lang="ts">
export type ContainerTag = "article" | "div" | "footer" | "header" | "section";
</script>

<script lang="ts" generics="TTag extends ContainerTag = 'div'">
import { Space, type SpaceSize } from "@xeho91/lib-design/space";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { Properties } from "csstype";
import type { HTMLAttributes } from "svelte/elements";
import type { TransitionConfig } from "svelte/transition";

// FIXME: This one doesn't work;
// type Attributes = Omit<HTMLAttributes<HTMLElementTagNameMap[TTag]>, "children" | "class">;
type Attributes = Omit<HTMLAttributes<HTMLElement>, "children" | "class">;
interface Props extends WithChildren, WithClass, Attributes {
	tag?: TTag;
	element?: HTMLElement;
	border_box_size?: ResizeObserverSize[];
	name: string;
	type?: Properties["containerType"];
	// Display
	grid?: boolean;
	// Justify
	align_content?: Properties["alignContent"];
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
	// Transitions
	transition?: (node: Element) => TransitionConfig;
	in?: (node: Element) => TransitionConfig;
	out?: (node: Element) => TransitionConfig;
}

const noop = () => ({});

let {
	tag = "div" as TTag,
	element = $bindable(),
	border_box_size = $bindable(),
	children,
	class: class_,
	// Container
	name,
	type = "normal",
	// Layout
	grid = false,
	align_content,
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

	style:container-name={name}
	style:container-type={type}

	class:flex={!grid}
	class:grid={grid}

	class:content-normal={align_content === "normal"}
	class:content-start={align_content === "start"}
	class:content-center={align_content === "center"}
	class:content-end={align_content === "end"}
	class:content-around={align_content === "space-around"}
	class:content-between={align_content === "space-between"}
	class:content-evenly={align_content === "space-evenly"}
	class:content-stretch={align_content === "stretch"}

	class:justify-normal={justify_content === "normal"}
	class:justify-start={justify_content === "start"}
	class:justify-center={justify_content === "center"}
	class:justify-end={justify_content === "end"}
	class:justify-around={justify_content === "space-around"}
	class:justify-between={justify_content === "space-between"}
	class:justify-evenly={justify_content === "space-evenly"}
	class:justify-stretch={justify_content === "stretch"}

	class={merge_classes(
		"_container",
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
		class_,
	)}
	in:in_
	out:out
>
	{@render children()}
</svelte:element>
