<script lang="ts">
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { Grid, type GridVariant } from "@xeho91/lib-design/grid";
import { merge_classes, merge_styles } from "@xeho91/lib-feature/css";
import type { ComponentProps } from "svelte";

import type { SectionHeight, SectionWidth } from "./util";

import { LAYOUT_DEFAULT_MAIN_MIN_HEIGHT } from "#layout/default/util";
import { Container } from "#primitive/container/mod";

type ContainerProps = Omit<ComponentProps<Container<"section", "grid">>, "name" | "tag" | "id" | "width" | "height">;
interface Props extends ContainerProps {
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
	box="grid"
	template_columns="subgrid"
	style={merge_styles(
		height === "full-main" && ["height", LAYOUT_DEFAULT_MAIN_MIN_HEIGHT.to_var(new Dimension(100,"lvh").to_value())],
		is_full_srreen && ["margin-inline", `calc(-50lvw - (${Grid.max.get("default").var} / 2))`],
	)}
	class={merge_classes(
		{
			"col-span-full": is_full_srreen || is_full_grid,
		},
		gutter && Grid.gutter.get(gutter).class("gap"),
		class_
	)}
>
	{@render children()}
</Container>
