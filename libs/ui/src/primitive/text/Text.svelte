<script lang="ts" generics="TTag extends TextHTMLTag = TextHTMLTag, TFamily extends FontFamilyName = FontFamilyName, TWeight extends TextWeight<TFamily> = TextWeight<TFamily>">
import { Color, type ColorType } from "@xeho91/lib-design/color";
import { Elevation, type ElevationLevel } from "@xeho91/lib-design/elevation";
import { Font } from "@xeho91/lib-design/font";
import type { FontFamilyName } from "@xeho91/lib-design/font/family";
import type { FontSizeKey } from "@xeho91/lib-design/font/size";
import { merge_classes, type WithClass } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

import type { TextColor, TextHTMLTag, TextWeight } from "./util";

import { Skeleton, set_skeleton_color } from "#primitive/skeleton/mod";

interface Props extends Omit<HTMLAttributes<HTMLElementTagNameMap[TextHTMLTag]>, "class">, WithClass {
	children: Snippet;
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
	 * Font's **family** from [design tokens](https://shan-shan.gitbook.io/handbook/design/brandbook/broom#typography)
	 */
	family?: TFamily | undefined;
	/**
	 * Font's **size** from [design tokens](https://shan-shan.gitbook.io/handbook/design/brandbook/broom#typography)
	 */
	size?: FontSizeKey | undefined;
	/**
	 * Font's **weight** from [design tokens](https://shan-shan.gitbook.io/handbook/design/brandbook/broom#typography)
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
}

const {
	children,
	class: class_,
	tag = "span" as TTag,
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
	class={merge_classes(
		"text",
		// Flex
		"inline-flex items-center gap-x-[0.5rex]",
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
>
	{#if loading}
		<Skeleton color={set_skeleton_color(color)} />
	{:else}
		{@render children()}
	{/if}
</svelte:element>

<style>
	@layer component.text {
		.text {
			transition:
				font-size ease-in-out 250ms,
				font-weight ease-in-out 250ms,
				--text-color-lightness ease-in-out 250ms,
				--text-color-chroma ease-in-out 250ms,
				--text-color-hue ease-in-out 250ms,
				--text-color-alpha ease-in-out 250ms;

			& :global(.icon) {
				margin-block-start: 0.25rex;
			}
		}
	}
</style>
