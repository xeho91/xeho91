<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import { Space } from "@xeho91/lib-design/space";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css/util";

import ColorScheme from "./ColorScheme.svelte";

import { Popover } from "#molecule/popover/mod";
import { Icon } from "#primitive/icon/mod";
import { Button } from "#semantic/button/mod";

interface Props extends WithClass {}

let {
	//
	class: class_,
}: Props = $props();

const id = "app-settings";
const color = "primary";
</script>

<Button
	data-label={"Settings"}
	popovertarget={id}
	{color}
	size="small"
	class={merge_classes(
		"button-app-settings",
		Color.class("text", { pseudo_element: "before" }),
		Color.get("primary", "solid", 12).class("text", {
			pseudo_element: "before",
			pseudo_class: "hover",
		}),
		Space.get("3xs").class("margin-inline-end", {
			pseudo_element: "before",
		}),
		// before
		"before:absolute",
		class_,
	)}
>
	<Icon name="settings" />
</Button>

<Popover
	{id}
	backdropped
	{color}
	class={merge_classes(
		"popover-app-settings",
		"origin-top-right mx-0 ",
		Space.get("3xs").class("margin-block-start"),
		Space.get("2xs").class("padding-block-end"),
	)}
>
	<ColorScheme />
</Popover>

<style>
	@layer reset {
		:global(.button-app-settings::before) {
			/*
			* WARN: Do not remove.
			* This is a a workaround to prevent appearance on initial page rendering
			*/
			color: transparent;
		}
	}
	@layer component {
		:global(.button-app-settings) {
			:global(&::before) {
				content: attr(data-label);

				position-anchor: --app-settings;
				inset-area: inline-start center;

				transition-duration: inherit;
				transition-timing-function: inherit;
				transition-property: background-color, color;
			}
			:global(
					&:has(+ .popover-app-settings:not(:popover-open)):not(
							:hover
						)::before
				) {
				--text-color-light-alpha: 0%;
				--text-color-dark-alpha: 0%;
			}
		}

		:global(.popover-app-settings) {
			position-anchor: --parent-anchor;
			inset-area: block-end span-inline-start;
		}
	}
</style>
