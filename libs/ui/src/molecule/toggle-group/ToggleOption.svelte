<script lang="ts">
import type { Reference } from "@xeho91/lib-css/reference";
import { Color } from "@xeho91/lib-design/color";
import { Space } from "@xeho91/lib-design/space";
import { Stroke } from "@xeho91/lib-design/stroke";
import { merge_classes } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";
import type { HTMLInputAttributes } from "svelte/elements";

import { type ToggleGroupColor, type ToggleGroupEntry, ToggleGroupState, type ToggleGroupValue } from "./util.svelte";

interface Props extends HTMLInputAttributes {
	children: Snippet;
	anchor: Reference;
	color: ToggleGroupColor;
	name: string;
	entry: ToggleGroupEntry;
	state: ToggleGroupState;
	resettable: boolean;
}

const {
	//
	children,
	anchor,
	color,
	entry,
	name,
	resettable,
	state,
	...rest_props
}: Props = $props();

let is_current = $derived(state.selected === entry.value);

let element: HTMLInputElement;

function handle_click() {
	if (is_current && element && resettable) {
		state.selected = undefined as unknown as ToggleGroupValue;
		element.checked = false;
	}
}
</script>

<label
	style:--anchor-name={anchor.toString()}
	title={entry.label}
	class={merge_classes(
		"toggle-option",
		"relative",
		"size-min-[44px]",
		Space.get("2xs").class("padding"),
		// Flex
		"flex place-content-center place-items-center",
		// Border
		Color.class("border"),
		Color.get(color, "solid", 6).class("border"),
		"border-solid",
		Stroke.default().class("inline-end"),
	)}
>
	<input
		{...rest_props}
		type="radio"
		bind:this={element}
		bind:group={state.selected}
		checked={is_current}
		{name}
		onclick={handle_click}
		value={entry.value}
		class={merge_classes(
			"appearance-none",
			"absolute inset-0 z--1",
			Color.class("background"),
			Color.get(color, "solid", 4).class("background"),
			Color.get(color, "solid", 5).class("background", { pseudo_class: "checked" }),
			Color.get(color, "solid", 5).class("background", { pseudo_class: "hover" }),
		)}
	>
	{@render children()}
</label>

<style>
@layer component {
	.toggle-option {
		transition-duration: var(--transition-dur);
		transition-property: border-color;
		transition-timing-function: var(--transition-fn);

		&:last-of-type {
			border-inline-end-width: 0;
		}
		&:has(input:focus) {
			z-index: 10;
		}

		input {
			border-radius: inherit;

			transition-duration: inherit;
			transition-property: background-color;
			transition-timing-function: inherit;

			outline-offset: -2px;
		}
	}
}
</style>
