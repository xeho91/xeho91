<script lang="ts" generics="TWidth extends number = number, THeight extends number = number">
import type { WithClass } from "@xeho91/lib-feature/css";
import type { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { BrandAssetTheme } from "#design";
import { set_id } from "#id";

interface Props extends WithClass, Omit<HTMLAttributes<SVGElement>, "class"> {
	children: Snippet;
	// Meta
	id: string;
	title: string;
	description: string;
	// Dimensions
	dimensions: Rectangle<TWidth, THeight>;
	// Design
	theme: BrandAssetTheme;
	svg?: SVGElement;
}

let {
	//
	children,
	class: class_,
	id,
	title,
	description,
	dimensions,
	theme,
	svg = $bindable(),
	...rest_props
}: Props = $props();

const width = $derived(dimensions.width);
const height = $derived(dimensions.height);

const id_title = set_id(id, "title");
const id_description = set_id(id, "description");
</script>

<svg
	{...rest_props}
	bind:this={svg}
	{id}
	role="img"
	aria-labelledby={`${id_title} ${id_description}`}
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`0 0 ${width} ${height}`}
	preserveAspectRatio="xMinYMin meet"
	style:--light={theme.foreground_color("light")?.oklch.toString()}
	style:--dark={theme.foreground_color("dark")?.oklch.toString()}
	class={class_}
>
	<title id={id_title}>{title}</title>
	<desc id={id_description}>{description}</desc>
	{@render children()}
</svg>

