<script lang="ts" generics="TWidth extends number = number, THeight extends number = number">
import type { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";
import type { Snippet } from "svelte";

import type { BrandAssetTheme } from "#design";
import { set_id } from "#id";

interface Props {
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

let { children, id, title, description, dimensions, theme, svg = $bindable() }: Props = $props();

const width = $derived(dimensions.width);
const height = $derived(dimensions.height);

const id_title = set_id(id, "title");
const id_description = set_id(id, "description");
</script>

<svg
	bind:this={svg}
	{id}
	role="img"
	aria-labelledby={`${id_title} ${id_description}`}
	xmlns="http://www.w3.org/2000/svg"
	viewBox={`0 0 ${width} ${height}`}
	preserveAspectRatio="xMinYMin meet"
	style:--light={theme.light_foreground?.oklch.toString()}
	style:--dark={theme.dark_foreground?.oklch.toString()}
>
	<style global>
		html,
		html[data-color-scheme="light"] {
			svg {
				color-scheme: light;
			}
		}
		html[data-color-scheme="dark"] {
			svg {
				color-scheme: dark;
			}
		}
	</style>
	<title id={id_title}>{title}</title>
	<desc id={id_description}>{description}</desc>
	{@render children()}
</svg>

