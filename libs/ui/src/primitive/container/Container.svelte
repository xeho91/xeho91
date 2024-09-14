<script lang="ts" context="module">
export type ContainerBox = "block" | "flex" | "grid";
</script>

<script lang="ts" generics="TTag extends BoxHTMLTag = 'div', TTBox extends ContainerBox = 'block'">
import { merge_classes, merge_styles } from "@xeho91/lib-feature/css";
import type { Properties } from "csstype";
import type { ComponentProps } from "svelte";

import { Box, FlexBox, GridBox, type BoxHTMLTag } from "#primitive/box/mod";

type NormalBoxProps = ComponentProps<typeof Box<TTag>>;
type FlexBoxProps = ComponentProps<typeof FlexBox<TTag>>;
type GridPropsBox = ComponentProps<typeof GridBox<TTag>>;
type BoxProps = TTBox extends "normal"
	? NormalBoxProps
	: TTBox extends "flex"
		? FlexBoxProps
		: TTBox extends "grid"
			? GridPropsBox
			: never;
type Props = BoxProps & {
	box?: ContainerBox;
	name: string;
	type?: Properties["containerType"];
};

let {
	// Component
	box = "block",
	name,
	type = "normal",
	// Shared
	children,
	class: class_,
	element = $bindable(),
	border_box_size = $bindable(),
	style,
	...rest_props
}: Props = $props();

const classes = merge_classes(
	//
	name,
	class_,
);
const styles = merge_styles(
	style,
	["container-name", name],
	["container-type", type],
);
</script>

{#if box === "block"}
	<Box
		{...rest_props}
		bind:element
		bind:border_box_size
		style={styles}
		class={classes}
	>
		{@render children()}
	</Box>
{:else if box === "flex"}
	<FlexBox
		{...rest_props}
		bind:element
		bind:border_box_size
		style={styles}
		class={classes}
	>
		{@render children()}
	</FlexBox>
{:else if box === "grid"}
	<GridBox
		{...rest_props}
		bind:element
		bind:border_box_size
		style={styles}
		class={classes}
	>
		{@render children()}
	</GridBox>
{/if}
