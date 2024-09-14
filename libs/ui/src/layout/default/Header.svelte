<script lang="ts">
import { Logo } from "@xeho91/lib-brand/logo";
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { Color } from "@xeho91/lib-design/color";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Space } from "@xeho91/lib-design/space";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { scroll } from "@xeho91/lib-feature/scroll";
import { fade } from "svelte/transition";

import { LAYOUT_DEFAULT_FADE, LAYOUT_DEFAULT_HEADER_MAIN_HEIGHT_REFERENCE } from "./util";

import { ButtonAppSettings } from "#organism/app-settings/mod";
import { GridBox } from "#primitive/box/mod";
import { Container } from "#primitive/container/mod";
import { Stack } from "#primitive/stack/mod";

interface Props extends WithClass {}

let {
	//
	class: class_,
}: Props = $props();

let element = $state<HTMLElement>();
let border_box_size = $state<ResizeObserverSize[]>();
let height = $derived(border_box_size?.[0]?.blockSize ?? 0);
let parent = $derived(element?.parentNode as HTMLElement);

$effect(() => {
	parent?.style.setProperty(
		LAYOUT_DEFAULT_HEADER_MAIN_HEIGHT_REFERENCE.toString(),
		new Dimension(height, "px").toString(),
	);
});
</script>

<Container
	tag="header"
	name="header-main"
	bind:element
	bind:border_box_size
	box="grid"
	template_columns="subgrid"
	height="fit"
	padding_y="2xs"
	border="solid"
	radius="xl"
	stroke="s"
	shadow={2}
	class={merge_classes(
		"header-main",
		scroll.direction === "down" &&
			!scroll.is_at_top &&
			!scroll.is_at_bottom &&
			"translate-y-[-100%]",
		// Layout
		"sticky z-10",
		Space.get("2xs").class("inset-block-start"),
		"snap-start",
		"self-start col-span-full",
		// Background
		Color.class("background"),
		Color.get("secondary", "blend", 4).class("background"),
		// Border
		Color.class("border"),
		Color.get("secondary", "blend", 6).class("border"),
		// Shadow
		Elevation.get(1).class("box-shadow", { pseudo_class: "hover" }),
		Elevation.get(1).class("box-shadow", { pseudo_class: "focus-within" }),
		Color.get("secondary", "blend", 1).class("box-shadow"),
		"backdrop-blur-lg",
		// Rest
		class_,
	)}
	in={(node) => fade(node, { ...LAYOUT_DEFAULT_FADE, delay: 100 })}
>
	<Stack
		width="fit"
		class={merge_classes(
			//
			"brand",
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
	<GridBox
		width="fit"
		class={merge_classes(
			//
			"actions",
			"col-end-12 justify-self-end",
		)}
	>
		<ButtonAppSettings />
	</GridBox>
</Container>

<style>
	@layer component {
		:global(.header-main) {
			view-transition-name: header-main;

			transition-duration: var(--transition-dur);
			transition-property: box-shadow, transform;
			transition-timing-function: var(--transition-fn);
		}
	}
</style>
