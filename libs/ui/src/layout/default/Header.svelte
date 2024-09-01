<script lang="ts">
import { Logo } from "@xeho91/lib-brand/logo";
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { Color } from "@xeho91/lib-design/color";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Radius } from "@xeho91/lib-design/radius";
import { Space } from "@xeho91/lib-design/space";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { fade } from "svelte/transition";

import {
	//
	LAYOUT_DEFAULT_FADE,
	LAYOUT_DEFAULT_GRID_GUTTER,
	LAYOUT_DEFAULT_HEADER_MAIN_HEIGHT_REFERENCE,
} from "./util";

import { ButtonAppSettings } from "#organism/app-settings/mod";
import { Container } from "#primitive/container/mod";
import { Stack } from "#primitive/stack/mod";

interface Props extends WithClass {}

let {
	//
	class: class_,
}: Props = $props();

let resize_observer = $state<ResizeObserver>();
let element = $state<HTMLElement>();
let height = $state<number>();

$effect(() => {
	if (resize_observer && element) resize_observer.observe(element);
});

$effect(() => {
	resize_observer = new ResizeObserver((entries) => {
		height = entries[0]?.borderBoxSize[0]?.blockSize;
	});
	() => resize_observer?.disconnect();
});

$effect(() => {
	if (height) {
		const parent = element?.parentNode as HTMLElement;
		parent.style.setProperty(
			LAYOUT_DEFAULT_HEADER_MAIN_HEIGHT_REFERENCE.toString(),
			new Dimension(height, "px").toString(),
		);
	}
});
</script>

<Container
	tag="header"
	name="header-main"
	bind:element
	grid
	class={merge_classes(
		"header-main",
		// Layout
		"sticky z-10",
		"w-[100lvw] h-fit",
		LAYOUT_DEFAULT_GRID_GUTTER.class("margin-block-start"),
		Space.get("2xs").class("inset-block-start"),
		Space.get("2xs").class("padding-block"),
		"snap-start",
		// Background
		Color.class("background"),
		Color.get("secondary", "blend", 4).class("background"),
		// Border
		Color.class("border"),
		Color.get("secondary", "blend", 6).class("border"),
		"border-solid",
		Stroke.get("s").class(),
		Radius.get("xl").class(),
		Elevation.class("box-shadow"),
		Elevation.get(2).class("box-shadow"),
		Elevation.get(1).class("box-shadow", { pseudo_class: "hover" }),
		Elevation.get(1).class("box-shadow", { pseudo_class: "focus-within" }),
		Color.class("box-shadow"),
		Color.get("secondary", "blend", 1).class("box-shadow"),
		"backdrop-blur-lg",
		// Rest
		class_,
	)}
	in={(node) => fade(node, { ...LAYOUT_DEFAULT_FADE, delay: 100 })}
>
	<Stack
		class={merge_classes(
			//
			"brand",
			"w-fit",
			"self-start col-start-2",
		)}
	>
		<Logo
			animated
			class={merge_classes(
				//
				"w-fit min-h[44px] max-h[44px]",
			)}
		/>
	</Stack>
	<div
		class={merge_classes(
			//
			"actions",
			"w-fit",
			"grid col-end-12 justify-self-end",
		)}
	>
		<ButtonAppSettings />
	</div>
</Container>

<style>
	@layer component {
		:global(.header-main) {
			grid-template-columns: subgrid;

			transition-duration: var(--transition-dur);
			transition-property: box-shadow;
			transition-timing-function: var(--transition-fn);
		}
	}
</style>
