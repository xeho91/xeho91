<script lang="ts" generics="TTag extends TextHTMLTag = TextHTMLTag, TFamily extends FontFamilyName = FontFamilyName, TWeight extends TextWeight<TFamily> = TextWeight<TFamily>">
import { Color, type ColorType } from "@xeho91/lib-design/color";
import { Elevation, type ElevationLevel } from "@xeho91/lib-design/elevation";
import { Font } from "@xeho91/lib-design/font";
import type { FontFamilyName } from "@xeho91/lib-design/font/family";
import type { FontSizeKey } from "@xeho91/lib-design/font/size";
import { type WithAnchor, type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { TextColor, TextHTMLTag, TextWeight } from "./util";

import { Skeleton, set_skeleton_color } from "#primitive/skeleton/mod";

interface Props
	extends WithAnchor,
		WithChildren,
		WithClass,
		Omit<HTMLAttributes<HTMLElementTagNameMap[TextHTMLTag]>, "children" | "class"> {
	/**
	 * HTML element tag for [text content](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#text_content).
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element#text_content}
	 */
	tag?: TTag | undefined;
	/**
	 * TODO: Add desc
	 */
	color?: TextColor | undefined;
	/**
	 * TODO: Add desc
	 */
	mode?: ColorType | undefined;
	/**
	 * TODO: Add desc
	 */
	family?: TFamily | undefined;
	/**
	 * TODO: Add desc
	 */
	size?: FontSizeKey | undefined;
	/**
	 * TODO: Add desc
	 */
	weight?: TWeight | undefined;
	/**
	 * TODO: Add desc
	 */
	shadow?: ElevationLevel | undefined;
	/**
	 * TODO: Add desc
	 */
	contrasted?: boolean | undefined;
	/**
	 * TODO: Add desc
	 */
	uppercased?: boolean | undefined;
	/**
	 * TODO: Add desc
	 */
	loading?: boolean | undefined;
	/**
	 * TODO: Add desc
	 */
	truncated?: boolean | undefined;
	/**
	 * TODO: Add desc
	 */
	nowrap?: boolean | undefined;
}

const {
	children,
	class: class_,
	tag = "span" as TTag,
	anchor,
	color,
	mode = "solid",
	family,
	size,
	weight,
	shadow,
	contrasted = false,
	uppercased = false,
	loading = false,
	truncated = false,
	nowrap = false,
}: Props = $props();

const _family = $derived(family && Font.family.get(family));
// @ts-expect-error: FIXME: I don't know how to satisfy this one
const _weight = $derived(weight && _family?.weight.get(weight));
const _selection_color = $derived.by(() => {
	if (color) {
		const type = "blend";
		const step = 5;
		if (color === "white") return Color.get("black", type, step);
		return Color.get(color, type, step);
	}
});
</script>

<svelte:element
	this={tag}
	style:position-anchor={anchor?.toString()}
	class={merge_classes(
		"text",
		// Typography
		_family?.class(),
		_weight?.class(),
		size && Font.size.get(size).class(),
		color && Color.class("text"),
		color && Color.get(color, mode, contrasted ? 12 : 11).class("text"),
		// Color
		Color.class("background", { pseudo_element: "selection" }),
		_selection_color?.class("background", { pseudo_element: "selection" }),
		// Shadow
		shadow && Elevation.class("text-shadow"),
		shadow && Elevation.get(shadow).class("text-shadow"),
		shadow && color && Color.class("text-shadow"),
		shadow && color && Color.get(color, "blend", 9).class("text-shadow"),
		class_,
	)}
	class:truncate={truncated}
	class:uppercase={uppercased}
	class:whitespace-nowrap={nowrap}
>
	{#if loading}
		<Skeleton color={set_skeleton_color(color)} />
	{:else}
		{@render children()}
	{/if}
</svelte:element>

<style>
	@layer component {
		.text {
			transition-duration: var(--transition-dur);
			transition-timing-function: var(--transition-fn);
			transition-property: color, font-size, font-weight;
		}
	}
</style>
