<script lang="ts">
import { Logo } from "@xeho91/lib-brand/logo";
import { Color } from "@xeho91/lib-design/color";
import { Space } from "@xeho91/lib-design/space";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css/util";
import { fade } from "svelte/transition";

import { LAYOUT_DEFAULT_FADE, LAYOUT_DEFAULT_SPACE_INLINE } from "./util";

import { Container } from "#primitive/container/mod";
import { Icon } from "#primitive/icon/mod";
import { Skeleton } from "#primitive/skeleton/mod";
import { Button } from "#semantic/button/mod";

interface Props extends WithClass {
	loading?: boolean;
}

let {
	//
	class: class_,
	loading = false,
}: Props = $props();

let rendered = $state(false);

$effect(() => {
	rendered = true;
});
</script>

<header
	class={merge_classes(
		"header-main",
		// Position
		"relative",
		// Layout
		"w[100lvw]",
		LAYOUT_DEFAULT_SPACE_INLINE.class("padding-inline"),
		Space.get("2xs").class("padding-block"),
		// Flex
		"flex place-content-center",
		// Background
		Color.class("background"),
		Color.get("secondary", "blend", 3).class("background"),
		// Border
		Color.class("border-bottom"),
		Color.get("secondary", "blend", 6).class("border-bottom"),
		"border-solid",
		Stroke.get("s").class("bottom"),
		// Rest
		class_,
	)}
	transition:fade={LAYOUT_DEFAULT_FADE}
>
	<Skeleton
		color="secondary"
		background_color="secondary"
		hidden={rendered && !loading}
		variant="rect"
		class={merge_classes(
			//
			"absolute inset-0 z-10",
			"h-full",
		)}
	/>
	<Container>
		<Logo
			animated
			class={merge_classes(
				//
				"logo",
				"max-h[50px]",
				"self-center",
			)}
		/>
		<div
			class={merge_classes(
				//
				"actions",
				"self-center justify-self-end",
			)}
		>
			<Button color="primary" size="small">
				<Icon name="settings" />
			</Button>
		</div>
	</Container>
</header>

<style>
	@layer component {
		.header-main {
			& > :global(.container) {
				grid-template-areas: "logo actions";

				& > :global(.logo) {
					grid-area: logo;
				}

				& > .actions {
					grid-area: actions;
				}
			}
		}
	}
</style>
