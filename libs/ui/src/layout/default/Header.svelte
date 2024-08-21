<script lang="ts">
import { Logo } from "@xeho91/lib-brand/logo";
import { Color } from "@xeho91/lib-design/color";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Radius } from "@xeho91/lib-design/radius";
import { Space } from "@xeho91/lib-design/space";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css/util";
import { fade } from "svelte/transition";

import { LAYOUT_DEFAULT_FADE, LAYOUT_DEFAULT_SPACE_INLINE } from "./util";

import { ButtonAppSettings } from "#organism/app-settings/mod";
import { Container } from "#primitive/container/mod";
import { Stack } from "#primitive/stack/mod";

interface Props extends WithClass {}

let {
	//
	class: class_,
}: Props = $props();
</script>

<header
	class={merge_classes(
		"header-main",
		// Position
		"sticky z-10",
		Space.get("3xs").class("inset-block-start"),
		// Layout
		"size-fit overflow-hidden",
		LAYOUT_DEFAULT_SPACE_INLINE.class("padding-inline"),
		Space.get("2xs").class("padding-block"),
		Space.get("2xs").class("margin-block-start"),
		// Flex
		"flex place-content-center justify-self-center",
		// Background
		Color.class("background"),
		Color.get("secondary", "blend", 3).class("background"),
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
		// Rest
		class_,
	)}
	transition:fade={LAYOUT_DEFAULT_FADE}
>
	<Container gap_column="l" grid="default" min_width max_width>
		<Stack
			align_items="center"
			direction="row"
			gap_column="3xs"
			class="brand"
		>
			<Logo
				animated
				class={merge_classes(
					//
					"min-h[44px] max-h[50px]",
					"self-center",
				)}
			/>
		</Stack>
		<div
			class={merge_classes(
				//
				"actions",
				"self-center justify-self-end",
			)}
		>
			<ButtonAppSettings />
		</div>
	</Container>
</header>

<style>
	@layer component {
		.header-main {
			transition-duration: var(--transition-dur);
			transition-property: box-shadow;
			transition-timing-function: var(--transition-fn);

			& > :global(.container) {
				grid-template-areas: "brand actions";

				& > :global(.brand) {
					grid-area: brand;
				}

				& > .actions {
					grid-area: actions;
				}
			}
		}
	}
</style>
