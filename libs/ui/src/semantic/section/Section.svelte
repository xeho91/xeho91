<script lang="ts">
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { Grid, type GridVariant } from "@xeho91/lib-design/grid";
import { type WithAnchor, merge_classes, merge_styles } from "@xeho91/lib-feature/css";
import type { ComponentProps } from "svelte";

import type { SectionHeight, SectionWidth } from "./util";

import { Container } from "#primitive/container/mod";

import { LAYOUT_DEFAULT_GRID_GUTTER, LAYOUT_DEFAULT_MAIN_MIN_HEIGHT } from "#layout/default/util";

type ContainerProps = Omit<ComponentProps<Container>, "grid" | "name" | "tag" | "id">;
interface Props extends WithAnchor, ContainerProps {
	id: string;
	width?: SectionWidth;
	height?: SectionHeight;
	gutter?: GridVariant;
}

let {
	//
	children,
	class: class_,
	width,
	height,
	gutter,
	...rest_props
}: Props = $props();

let is_full_grid = width === "full-grid";
let is_full_srreen = width === "full-screen";
</script>

<Container
	{...rest_props}
	tag="section"
	name="section"
	grid
	style={merge_styles(
		height === "full-main" && ["height", LAYOUT_DEFAULT_MAIN_MIN_HEIGHT.to_var(new Dimension(100,"lvh").to_value())],
		is_full_srreen && ["margin-inline", `calc(-50lvw - (${Grid.max.get("default").var} / 2))`],
	)}
	class={merge_classes(
		//
		"section",
		"grid",
		{
			"col-span-full": is_full_srreen || is_full_grid,
		},
		gutter === "default" && LAYOUT_DEFAULT_GRID_GUTTER.class("gap"),
		class_
	)}
>
	{@render children()}
</Container>

<style>
@layer component {
	:global(.section) {
		grid-template-columns: subgrid;
	}
}
</style>
