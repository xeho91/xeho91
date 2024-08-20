<script lang="ts">
import { Reference } from "@xeho91/lib-css/reference";
import { Color } from "@xeho91/lib-design/color";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Radius } from "@xeho91/lib-design/radius";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { PopoverColor } from "./util";

import { Container } from "#primitive/container/mod";
import { Icon } from "#primitive/icon/mod";
import { Button } from "#semantic/button/mod";

type Attributes = HTMLAttributes<HTMLDivElement>;
type ExtendedAttributes = Omit<HTMLAttributes<HTMLDivElement>, "id" | "class" | "children" | "popover"> & {
	type?: NonNullable<Attributes["popover"]>;
};
interface Props extends WithClass, ExtendedAttributes {
	id: NonNullable<HTMLAttributes<HTMLDivElement>["id"]>;
	children: Snippet<[PopoverColor?]>;
	element?: HTMLDivElement | undefined;
	backdropped?: boolean;
	color?: PopoverColor;
	visible?: boolean;
}

let {
	//
	id,
	element = $bindable(),
	children,
	class: class_,
	backdropped = false,
	color = "primary",
	type = "auto",
	visible = false,
	...rest_props
}: Props = $props();

$effect(() => {
	if (visible) element?.showPopover();
});
</script>

<div
	bind:this={element}
	{...rest_props}
	{id}
	popover={type}
	style:position-anchor={new Reference(id).toString()}
	class={merge_classes(
		//
		"popover",
		// Background
		Color.class("background"),
		Color.get(color, "solid", 4).class("background"),
		// Background - backdrop
		backdropped && Color.class("background", { pseudo_element: "backdrop" }),
		backdropped && Color.get("gray", "blend", 5).class("background", { pseudo_element: "backdrop" }),
		// Border
		"border-solid",
		Stroke.get("xs").class(),
		Color.class("border"),
		Color.get(color, "solid", 7).class("border"),
		Radius.get("m").class(),
		// Shadow
		Color.class("box-shadow"),
		Color.get(color, "blend", 8).class("box-shadow"),
		Elevation.class("box-shadow"),
		Elevation.get(1).class("box-shadow"),
		// Other
		class_,
	)}
>
	<Container
		gap_column="2xs"
		padding_x="s"
		padding_y="xs"
	>
		{#if type === "manual"}
			<Button
				popovertarget={id}
				popovertargetaction="hide"
				{color}
				size="small"
				variant="outlined"
				class="close"
			>
				<Icon name="close" />
			</Button>
		{/if}
		<div class="content">
			{@render children(color)}
		</div>
	</Container>
</div>

<style>
@layer reset {
	.popover {
		padding: 0;
	}
}

@layer component {
	.popover {
		transition-behavior: allow-discrete;
		transition-duration: var(--transition-dur);
		transition-property: box-shadow, opacity, scale, display, overlay;
		transition-timing-function: var(--transition-fn);

		&:not(:popover-open) {
			opacity: 0;
			scale: 0.25;
			--box-shadow-1-y: 0px;
			--box-shadow-1-spread: 0px;
			--box-shadow-1-blur: 0px;
			--box-shadow-2-y: 0px;
			--box-shadow-3-spread: 0px;
			--box-shadow-3-blur: 0px;
			--box-shadow-3-y: 0px;
			--box-shadow-3-spread: 0px;
			--box-shadow-3-blur: 0px;
		}
		&:popover-open {
			opacity: 1;
			scale: 1;
			@starting-style {
				opacity: 0;
				scale: 0.25;
				--box-shadow-1-y: 0px;
				--box-shadow-1-spread: 0px;
				--box-shadow-1-blur: 0px;
				--box-shadow-2-y: 0px;
				--box-shadow-3-spread: 0px;
				--box-shadow-3-blur: 0px;
				--box-shadow-3-y: 0px;
				--box-shadow-3-spread: 0px;
				--box-shadow-3-blur: 0px;
			}
		}

		&::backdrop {
			transition-behavior: allow-discrete;
			transition-duration: inherit;
			transition-property: background-color, overlay, display;
			transition-timing-function: inherit;
		}
		&:not(:popover-open)::backdrop {
			--background-color-light-alpha: 0%;
			--background-color-dark-alpha: 0%;
		}
		@starting-style {
			&:popover-open::backdrop {
				--background-color-light-alpha: 0%;
				--background-color-dark-alpha: 0%;
			}
		}

		&[popover="manual"] {
			& > :global(.container) {
				grid-template-areas:
					"content close"
					"content .";
				grid-template-columns: 1fr auto;
				grid-template-rows: auto 1fr;

				& > :global(.button.close) {
					grid-area: close;
				}
				& > .content {
					grid-area: content;
				}
			}
		}
		&:not([popover="manual"]) {
			& > :global(.container) {
				grid-template-areas: "content";
			}
		}

		& .content {
			grid-area: content;
		}
	}
}
</style>
