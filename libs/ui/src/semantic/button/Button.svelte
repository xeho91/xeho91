<script lang="ts">
import { Reference } from "@xeho91/lib-css/reference";
import { Color } from "@xeho91/lib-design/color";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

import {
	type ButtonColor,
	type ButtonSize,
	type ButtonVariant,
	set_button_color_class_names,
	set_button_size_class_names,
	set_button_text_color,
	set_button_text_size,
} from "./util";

import { Text } from "#primitive/text/mod";

type Props = WithClass &
	HTMLButtonAttributes & {
		children: Snippet;
		color?: ButtonColor;
		size?: ButtonSize;
		variant?: ButtonVariant;
	};

let {
	children,
	class: class_,
	color = "secondary",
	size = "medium",
	variant = "filled",
	...rest_props
}: Props = $props();

let element = $state<HTMLButtonElement>();

let has_icon_only = $derived(element?.innerText.length === 0);

const anchor_name_reference = rest_props.popovertarget ? new Reference(rest_props.popovertarget) : undefined;
</script>

<button
	bind:this={element}
	{...rest_props}
	class={merge_classes(
		"button",
		color,
		variant,
		"w-fit size-min-[44px]",
		...set_button_size_class_names(size, has_icon_only),
		"inline-flex flex-row place-items-center place-content-center",
		Color.class("background"),
		...set_button_color_class_names(variant, color),
		"border-solid",
		Color.class("border"),
		Stroke.get("xs").class(),
		"leading-none",
		Elevation.class("box-shadow"),
		Elevation.get(2).class("box-shadow"),
		Elevation.get(1).class("box-shadow", { pseudo_class: "active" }),
		Elevation.get(1).class("box-shadow", { pseudo_class: "hover" }),
		Elevation.get(1).class("box-shadow", { pseudo_class: "focus" }),
		class_,
	)}
	style:anchor-name={anchor_name_reference?.toString()}
>
	<Text
		color={set_button_text_color(variant, color)}
		size={set_button_text_size(size, has_icon_only)}
		mode={"solid"}
		class={merge_classes(
			"inline-flex gap-x-[1ch]",
			{
				["aspect-square h[1em]"]: has_icon_only,
			},
		)}
	>
		{@render children()}
	</Text>
</button>

<style>
	@layer component {
		.button {
			transition-timing-function: var(--transition-fn);
			transition-duration: var(--transition-dur);
			/* prettier-ignore */
			transition-property:
				var(--transition-props-color),
				var(--transition-props-shadow),
				padding-inline,
				padding-block,
				border-radius
			;

			&.transparent:not(:hover):not(:focus):not(:active) {
				--background-color-alpha: 0%;
				--border-color-alpha: 0%;
			}
		}
	}
</style>
