<script lang="ts" generics="TTag extends ButtonTag = 'button'">
import { Color } from "@xeho91/lib-design/color";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Stroke } from "@xeho91/lib-design/stroke";
import { merge_classes, type WithClass } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import {
	type ButtonColor,
	type ButtonSize,
	type ButtonTag,
	type ButtonVariant,
	set_button_color_class_names,
	set_button_size_class_names,
	set_button_text_color,
	set_button_text_size,
} from "./util";

import { Text } from "#primitive/text/mod";

type Element = TTag extends "a" ? HTMLAnchorElement : TTag extends "button" ? HTMLButtonElement : never;
type Attributes = Omit<HTMLAttributes<Element>, "class" | "children">;

interface Props extends WithClass, Attributes {
	tag?: TTag;
	children: Snippet;
	color?: ButtonColor;
	size?: ButtonSize;
	variant?: ButtonVariant;
}

let {
	children,
	class: class_,
	tag = "button" as TTag,
	color = "secondary",
	size = "medium",
	variant = "filled",
	...rest_props
}: Props = $props();
let element = $state<HTMLAnchorElement | HTMLButtonElement | undefined>();

let has_icon_only = $derived(element?.innerText.length === 0);
</script>


<svelte:element
	this={tag}
	bind:this={element}
	class={merge_classes(
		"button",
		color,
		variant,
		"inline-flex flex-row justify-center",
		...set_button_size_class_names(size, has_icon_only),
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
	{...rest_props as TTag extends "a" ? HTMLAttributes<HTMLAnchorElement> : HTMLAttributes<HTMLButtonElement>}
>
	<Text
		color={set_button_text_color(variant, color)}
		size={set_button_text_size(size)}
		mode={"solid"}
		class={merge_classes(
			"inline-flex gap-x-[1ch]",
			{
				["min-w-[1ch] min-h-[1ch] aspect-square"]: has_icon_only,
			},
		)}
	>
		{@render children()}
	</Text>
</svelte:element>

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
