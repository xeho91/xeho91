<script lang="ts" generics="TTag extends TextHTMLTag = TextHTMLTag">
import { Color, type ColorType } from "@xeho91/lib-design/color";
import { Elevation, type ElevationLevel } from "@xeho91/lib-design/elevation";
import { Font } from "@xeho91/lib-design/font";
import type { FontFamilyName } from "@xeho91/lib-design/font/family";
import type { FontSizeKey } from "@xeho91/lib-design/font/size";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { type WithAnchor, type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { noop } from "@xeho91/lib-snippet/function";
import type { Properties } from "csstype";
import type { HTMLAttributes } from "svelte/elements";
import type { TransitionConfig } from "svelte/transition";

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
	family?: FontFamilyName | undefined;
	/**
	 * TODO: Add desc
	 */
	size?: FontSizeKey | undefined;
	/**
	 * TODO: Add desc
	 */
	weight?: TextWeight | undefined;
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
	align?: Properties["textAlign"];
	// Transitions
	// Transitions
	in?: (node: Element) => TransitionConfig;
	out?: (node: Element) => TransitionConfig;
}

const {
	children,
	class: class_,
	tag = "span" as TTag,
	anchor,
	color,
	mode = "opaque",
	family,
	size,
	weight,
	shadow,
	contrasted = false,
	uppercased = false,
	loading = false,
	truncated = false,
	nowrap = false,
	align,
	// Transition
	in: in_ = noop,
	out: out_ = noop,
	onintrostart,
	onintroend,
	onoutrostart,
	onoutroend,
	...rest_props
}: Props = $props();

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
	{...rest_props}
	this={tag}
	style:position-anchor={anchor?.toString()}

	class:text-start={align === "start"}
	class:text-center={align === "center"}
	class:text-end={align === "end"}

	class:font-thin={weight === "thin"}
	class:font-extralight={weight === "extra-light"}
	class:font-light={weight === "light"}
	class:font-normal={weight === "regular"}
	class:font-medium={weight === "medium"}
	class:font-semibold={weight === "semi-bold"}
	class:font-bold={weight === "bold"}
	class:font-extrabold={weight === "extra-bold"}
	class:font-black={weight === "black"}

	class={merge_classes(
		"text",
		// Typography
		family && Font.family.get(family).class(),
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
	in:in_
	out:out_
	onintrostart={onintrostart}
	onintroend={onintroend}
	onoutrostart={onoutrostart}
	onoutroend={onoutroend}
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
