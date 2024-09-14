<script lang="ts" generics="TTag extends BoxHTMLTag = 'div'">
import { merge_classes, merge_styles } from "@xeho91/lib-feature/css";
import type { Properties } from "csstype";
import type { ComponentProps } from "svelte";

import Box from "./Box.svelte";

import type { BoxHTMLTag } from "./util";

type BoxProps = ComponentProps<Box<TTag>>;
interface Props extends BoxProps {
	flow?: Properties["gridAutoFlow"];
	columns?: "auto" | "min" | "max" | "fr";
	rows?: "auto" | "min" | "max" | "fr";
	template_columns?: Properties["gridTemplateColumns"];
	template_rows?: Properties["gridTemplateRows"];
}

let {
	flow,
	columns,
	rows,
	template_columns,
	template_rows,
	// Shared
	class: class_,
	children,
	element = $bindable(),
	border_box_size = $bindable(),
	style,
	...rest_props
}: Props = $props();
</script>

<Box
	{...rest_props}
	bind:element
	bind:border_box_size
	style={merge_styles(
		style,
		["grid-template-columns", template_columns],
		["grid-template-rows", template_rows],
	)}
	class={merge_classes(
		"grid",
		// Flow
		flow === "column" && "grid-flow-col",
		flow === "column dense" && "grid-flow-col-dense",
		flow === "dense" && "grid-flow-dense",
		flow === "row" && "grid-flow-row",
		flow === "row dense" && "grid-flow-row-dense",
		// Columns
		columns === "auto" && "auto-cols-auto",
		columns === "min" && "auto-cols-min",
		columns === "max" && "auto-cols-max",
		columns === "fr" && "auto-cols-fr",
		// Rows
		rows === "auto" && "grid-rows-auto",
		rows === "min" && "grid-rows-min",
		rows === "max" && "grid-rows-max",
		rows === "fr" && "grid-rows-fr",
		// Template Columns
		template_columns === "subgrid" && "grid-cols-subgrid",
		// Template Rows
		template_rows === "subgrid" && "grid-rows-subgrid",
		class_,
	)}
>
	{@render children()}
</Box>
