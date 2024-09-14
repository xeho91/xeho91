<script lang="ts" generics="TTag extends BoxHTMLTag = 'div'">
import { merge_classes } from "@xeho91/lib-feature/css";
import type { Properties } from "csstype";
import type { ComponentProps } from "svelte";

import Box from "./Box.svelte";

import type { BoxHTMLTag } from "./util";

type BoxProps = ComponentProps<Box<TTag>>;
type Props = BoxProps & {
	direction?: Properties["flexDirection"];
};

let {
	direction,
	// Shared
	class: class_,
	children,
	element = $bindable(),
	border_box_size = $bindable(),
	...rest_props
}: Props = $props();
</script>

<Box
	{...rest_props}
	bind:element
	bind:border_box_size
	class={merge_classes(
		"flex",
		direction === "column" && "flex-col",
		direction === "column-reverse" && "flex-col-reverse",
		direction === "column" && "flex-col",
		direction === "row-reverse" && "flex-row-reverse",
		class_,
	)}
>
	{@render children()}
</Box>
