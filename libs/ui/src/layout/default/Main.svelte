<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";

interface Props extends WithClass {
	header: Snippet<[boolean]>;
	content: Snippet<[boolean]>;
	footer: Snippet<[boolean]>;
}

let {
	//
	class: class_,
	header,
	content,
	footer,
}: Props = $props();

let rendered = $state(false);

const color_1 = Color.get("secondary", "blend", 2);
const color_2 = Color.get("primary", "blend", 3);

$effect(() => {
	rendered = true;
});
</script>

<main
		class={merge_classes(
		//
			"overflow-hidden",
		"w[100lvw] h[100lvh]",
		"grid",
		class_,
	)}
	style:--radial-gradient-color-1-light={color_1.light_dark.light.oklch.toString()}
	style:--radial-gradient-color-1-dark={color_1.light_dark.dark.oklch.toString()}
	style:--radial-gradient-color-2-light={color_2.light_dark.light.oklch.toString()}
	style:--radial-gradient-color-2-dark={color_2.light_dark.dark.oklch.toString()}
>
	{#if rendered}
		{@render header(!rendered)}
		{@render content(!rendered)}
		{@render footer(!rendered)}
	{/if}
</main>

<style>
@layer component {
	main {
		grid-template-areas:
			"header"
			"content"
			"footer";
		grid-template-rows: auto 1fr auto;

		--radial-gradient-color-1: light-dark(var(--radial-gradient-color-1-light), var(--radial-gradient-color-1-dark));
		--radial-gradient-color-2: light-dark(var(--radial-gradient-color-2-light), var(--radial-gradient-color-2-dark));
		background-image:
			radial-gradient(at 25% 25%, var(--radial-gradient-color-1) 0px, transparent 50%),
			radial-gradient(at 25% 75%, var(--radial-gradient-color-2) 0px, transparent 50%),
			radial-gradient(at 50% 50%, var(--radial-gradient-color-1) 0px, transparent 50%),
			radial-gradient(at 75% 25%, var(--radial-gradient-color-2) 0px, transparent 50%),
			radial-gradient(at 75% 75%, var(--radial-gradient-color-1) 0px, transparent 50%);

		& > :global(.header-main) {
			grid-area: header;
		}
		& > :global(.content-main) {
			grid-area: content;
		}
		& > :global(.footer-main) {
			grid-area: footer;
		}
	}
}
</style>
