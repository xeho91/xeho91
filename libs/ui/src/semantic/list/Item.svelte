<script lang="ts">
import { Space, type SpaceSize } from "@xeho91/lib-design/space";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";
import type { TransitionConfig } from "svelte/transition";

interface Props extends WithClass {
	children: Snippet;
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

const noop = () => ({});

let {
	children,
	class: class_,
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
	out: out_ = noop,
}: Props = $props();
</script>

<li
	in:in_
	out:out_
	class={merge_classes(
		"item",
		// Paddings
		padding && Space.get(padding).class("padding"),
		padding_x && Space.get(padding_x).class("padding-inline"),
		padding_x_start && Space.get(padding_x_start).class("padding-inline-start"),
		padding_x_end && Space.get(padding_x_end).class("padding-inline-end"),
		padding_y && Space.get(padding_y).class("padding-block"),
		padding_y_start && Space.get(padding_y_start).class("padding-block-start"),
		padding_y_end && Space.get(padding_y_end).class("padding-block-end"),
		// Margins
		margin && Space.get(margin).class("margin"),
		margin_x && Space.get(margin_x).class("margin-inline"),
		margin_x_start && Space.get(margin_x_start).class("margin-block-start"),
		margin_x_end && Space.get(margin_x_end).class("margin-block-end"),
		margin_y && Space.get(margin_y).class("margin-block"),
		margin_y_start && Space.get(margin_y_start).class("margin-block-start"),
		margin_y_end && Space.get(margin_y_end).class("margin-block-end"),
		// other
		class_,
	)}
>
	{@render children()}
</li>
