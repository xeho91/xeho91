<script lang="ts">
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { Snippet } from "svelte";
import { fade } from "svelte/transition";

import { Skeleton } from "#primitive/skeleton/mod";
import { LAYOUT_DEFAULT_FADE } from "./util";

interface Props extends WithClass {
	children: Snippet;
	loading?: boolean;
}

let {
	//
	class: class_,
	children,
	loading = false,
}: Props = $props();

let rendered = $state(false);

$effect(() => {
	rendered = true;
});
</script>

<div
	class={merge_classes(
		//
		"content-main",
		"relative",
		"w[100lvw] h-full min-h[50lvh]",
		"flex",
		class_,
	)}
	in:fade={{...LAYOUT_DEFAULT_FADE, delay: 750 }}
	out:fade={LAYOUT_DEFAULT_FADE}
>
	<Skeleton
		color="secondary"
		background_color="secondary"
		hidden={rendered && !loading}
		variant="rect"
		class={merge_classes(
			//
			"absolute inset-0 z-10",
			"h-full",
		)}
	/>
	{@render children()}
</div>
