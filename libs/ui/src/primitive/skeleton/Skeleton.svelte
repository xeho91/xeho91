<script lang="ts" generics="TColor extends SkeletonColor = 'gray'">
import { Color } from "@xeho91/lib-design/color";
import { Radius } from "@xeho91/lib-design/radius";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";

import type { SkeletonColor, SkeletonVariant } from "./util";

interface Props extends WithClass {
	color?: TColor;
	count?: number;
	variant?: SkeletonVariant;
}

const {
	//
	class: class_,
	color = "gray" as TColor,
	count = 1,
	variant = "text",
}: Props = $props();
</script>

{#each { length: count } as _}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<span
		class={merge_classes(
			"skeleton",
			variant,
			"outline-none relative overflow-hidden will-change-transform",
			"inline-flex",
			"w-full h-full min-w-[1em] min-h-[1em]",
			"bg-no-repeat",
			Color.class("background"),
			Color.get(color, "blend", 5).class("background"),
			variant === "circle" && Radius.get("circle").class(),
			variant === "text" && Radius.get("m").class(),
			class_,
		)}
		style:--color-1={Color.get(
			color,
			"blend",
			3,
		).light_dark.light.oklch.toString()}
		style:--color-2={Color.get(
			"gray",
			"blend",
			5,
		).light_dark.light.oklch.toString()}
		aria-busy="true"
		aria-valuemin="0"
		aria-valuemax="100"
		aria-valuetext="Loading..."
		role="progressbar"
		tabindex="0"
	>
	</span>
{/each}

<style>
	@layer component.skeleton {
		.skeleton {
			animation: progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;

			background-size: 200px 100%;
			background-image: linear-gradient(
				90deg,
				var(--color-1),
				var(--color-2),
				var(--color-1),
				var(--color-2)
			);

			@media (prefers-reduced-motion: reduce) {
				animation: none;
				background-image: none;
			}
		}

		@keyframes progress {
			from {
				background-position: -200px 0;
			}
			to {
				background-position: calc(200px + 100%) 0;
			}
		}
	}
</style>
