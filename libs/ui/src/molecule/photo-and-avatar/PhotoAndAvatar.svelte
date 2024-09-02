<script context="module" lang="ts">
export const PHOTO_AND_AVATAR_ANCHOR = new Reference("photo-and-avatar");
</script>

<script lang="ts">
	import { Avatar } from "@xeho91/lib-brand/avatar";
	import { Reference } from "@xeho91/lib-css/reference";
	import { Dimension } from "@xeho91/lib-css/value/dimension";
	import { Color } from "@xeho91/lib-design/color";
	import { Elevation } from "@xeho91/lib-design/elevation";
	import { Radius } from "@xeho91/lib-design/radius";
	import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
	import type { HTMLAttributes } from "svelte/elements";

	type Attributes = Omit<
		HTMLAttributes<HTMLDivElement>,
		"children" | "class"
	>;
	interface Props extends WithClass, Attributes {}

	let { class: class_, ...rest_props }: Props = $props();

	const radius = Radius.get("xl");
</script>

<div
	{...rest_props}
	style:--avatar-size={new Dimension(15, "cqb").toString()}
	class={merge_classes(
		//
		"photo-and-avatar",
		"contents",
	)}
>
	<picture
		style:anchor-name={PHOTO_AND_AVATAR_ANCHOR.toString()}
		style:--radius={radius.var.toString()}
		class={merge_classes(
			"photo",
			"w-full min-w-[25cqw] max-w-[65cqw] aspect-square",
			"flex",
			// Background
			Color.class("background"),
			Color.get("accent", "solid", 8).class("background"),
			// Border
			radius.class(),
			// Shadow
			Elevation.class("text-shadow"),
			Elevation.get(3).class("text-shadow"),
			Color.class("text-shadow"),
			Color.get("accent", "blend", 8).class("text-shadow"),
			class_,
		)}
	>
	</picture>

	<Avatar
		anchor={PHOTO_AND_AVATAR_ANCHOR}
		animated
		class={merge_classes(
			//
			"avatar",
			"absolute",
			"h[var(--avatar-size)]",
		)}
	/>
</div>

<style>
	@layer component {
		.photo-and-avatar {
			--corner-size: calc(var(--avatar-size) / 2);
		}

		.photo {
			filter: drop-shadow(var(--text-shadow-1));

			--mask-size-x: calc(2 * var(--radius));
			--mask-size-y: calc(2 * var(--radius));
			/* prettier-ignore */
			--mask-size-and-repeat:
				var(--mask-size-x)
				var(--mask-size-y)
				radial-gradient(#000 70%, #0000 72%)
				no-repeat;
			--mask-1-position-x: calc(var(--corner-size) + var(--radius));
			/* prettier-ignore */
			--mask-1: var(--mask-1-position-x) bottom / var(--mask-size-and-repeat);

			/* prettier-ignore */
			--mask-2-position-y: calc(var(--corner-size) + var(--radius));
			/* prettier-ignore */
			--mask-2: bottom var(--mask-2-position-y) left / var(--mask-size-and-repeat);

			/* prettier-ignore */
			--mask-3-position-x: radial-gradient(
				var(--corner-size) at 0 100%,
				#0000 99%,
				#000 101%
			);
			--mask-3-position-y: calc(-1 * var(--radius));
			/* prettier-ignore */
			--mask-3: var(--mask-3-position-x) var(--radius) var(--mask-3-position-y) no-repeat;

			/* prettier-ignore */
			--mask-4-conic-x: calc(var(--corner-size) + 2 * var(--radius));
			/* prettier-ignore */
			--mask-4-conic-y: calc(100% - var(--corner-size) - 2 * var(--radius));
			/* prettier-ignore */
			--mask-4: conic-gradient(
				from 180deg at var(--mask-4-conic-x) var(--mask-4-conic-y),
				#0000 25%,
				#000 0
			);

			/* prettier-ignore */
			mask:
				var(--mask-1),
				var(--mask-2),
				var(--mask-3),
				var(--mask-4);
		}

		:global(.avatar) {
			inset-inline-end: anchor(left);
			inset-block-start: anchor(bottom);
			translate: var(--corner-size) calc(-1 * var(--corner-size));
		}
	}
</style>
