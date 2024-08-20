<script lang="ts" generics="TColor extends SkeletonColor = 'gray'">
import { Color } from "@xeho91/lib-design/color";
import { Radius } from "@xeho91/lib-design/radius";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { fade } from "svelte/transition";

import type { SkeletonColor, SkeletonVariant } from "./util";

interface Props extends WithClass {
	color?: TColor;
	background_color?: SkeletonColor;
	count?: number;
	variant?: SkeletonVariant;
	hidden?: boolean;
}

let {
	//
	class: class_,
	color = "gray" as TColor,
	background_color = "gray",
	count = 1,
	hidden = false,
	variant = "text",
}: Props = $props();

let rendered = $state(false);

let color_1 = $derived(Color.get(color, "blend", 3));
let color_2 = $derived(Color.get(color, "blend", 1));

$effect(() => {
	rendered = true;
});
</script>

{#if !hidden}
	<div
		class={merge_classes(
			//
			"skeleton",
			"inline-flex",
			Color.class("background"),
			Color.get(background_color, "solid", 3).class("background"),
			variant === "circle" && Radius.get("circle").class(),
			variant === "text" && Radius.get("m").class(),
			class_,
		)}
		style:--color-1={color_1.light_dark.light.atomized_oklch.toString()}
		style:--color-2={color_2.light_dark.light.atomized_oklch.toString()}
		in:fade|global={{ delay: 250, duration: rendered ? 250 : 0 }}
		out:fade|global={{ delay: 250, duration: 250 }}
	>
		{#each { length: count } as _}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<span
				class={merge_classes(
					variant,
					"outline-none relative overflow-hidden will-change-transform",
					"inline-flex",
					"w-full min-w-[1em] min-h-[1em]",
					"bg-no-repeat",
				)}
				aria-busy="true"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuetext="Loading..."
				role="progressbar"
				tabindex="0"
			>
			</span>
		{/each}
	</div>
{/if}

<style>
	@layer component {
		.skeleton {
			animation: progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;

			background-size: 200px 100%;
			background-image: linear-gradient(
				90deg,
				var(--color-1),
				var(--color-2),
				var(--color-1)
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
