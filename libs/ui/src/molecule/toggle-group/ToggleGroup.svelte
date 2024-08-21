<script lang="ts" generics="TResettable extends boolean = false, TValue extends ToggleGroupValue = ToggleGroupValue">
import { Reference } from "@xeho91/lib-css/reference";
import { Color } from "@xeho91/lib-design/color";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Radius } from "@xeho91/lib-design/radius";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";

import { type ToggleGroupColor, type ToggleGroupEntry, ToggleGroupState, type ToggleGroupValue } from "./util.svelte";

import ToggleOption from "./ToggleOption.svelte";

import { Stack } from "#primitive/stack/mod";
import { Text } from "#primitive/text/mod";

interface Props extends WithClass {
	children: Snippet<[TValue, ToggleGroupState]>;
	color?: ToggleGroupColor;
	default?: TValue;
	entries: Iterable<ToggleGroupEntry<TValue>>;
	name: string;
	resettable?: TResettable;
	onchange?: TResettable extends true ? (value?: TValue) => void : (value: TValue) => void;
}

let {
	//
	children,
	class: class_,
	color = "primary",
	default: default_,
	entries,
	name,
	onchange,
	resettable = false as TResettable,
}: Props = $props();

const state = new ToggleGroupState(default_ as TValue);
const anchor = new Reference(`toggle-group-${name}`);

$effect(() => {
	if (onchange) onchange(state.selected);
});
</script>

<Stack
	direction="row"
	class={merge_classes(
		'toggle-group',
		"w-fit overflow-hidden",
		// Box Shadow
		Elevation.class("box-shadow"),
		Elevation.get(2).class("box-shadow"),
		Elevation.get(1).class("box-shadow", { pseudo_class: "hover" }),
		Color.class("box-shadow"),
		Color.get(color, "blend", 8).class("box-shadow"),
		// Border
		"border-solid",
		Stroke.default().class("block"),
		Stroke.default().class("inline-start", { pseudo_class: "first-of-type" }),
		Stroke.default().class("inline-end"),
		Radius.get("l").class(),
		Color.class("border"),
		Color.get(color, "solid", 6).class("border"),
		class_
	)}
>
	{#each entries as entry}
		<ToggleOption {anchor} {resettable} {color} {name} {entry} {state}>
			<Text {color}>
				{@render children(entry.value, state)}
			</Text>
		</ToggleOption>
	{/each}
		<span
			style:position-anchor={anchor.toString()}
			class={merge_classes(
				"indicator",
				"absolute z-100",
				"size-[1ch]",
				Color.class("background"),
				Color.get(color, "solid", 11).class("background"),
				Radius.get("circle").class(),
				"pointer-events-none",
			)}
		></span>
</Stack>


<style>
@layer component {
	:global(.toggle-group) {
		transition-duration: var(--transition-dur);
		transition-property: background-color, border-color, box-shadow;
		transition-timing-function: var(--transition-fn);

		:global(&:not(:has(input:checked))) .indicator {
			--background-color-light-alpha: 0%;
			--background-color-dark-alpha: 0%;
		}
		:global(label:has(input:checked)) {
			anchor-name: var(--anchor-name);
		}

		.indicator {
			inset-block: anchor(bottom);
			inset-inline: anchor(center);
			translate: -50% -4px;

			transition-duration: var(--transition-dur);
			transition-property: all;
			transition-timing-function: var(--transition-fn);
		}
	}
}
</style>
