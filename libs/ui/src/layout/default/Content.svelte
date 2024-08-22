<script lang="ts">
import type { WithChildren } from "@xeho91/lib-feature/component";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { fade } from "svelte/transition";

import { LAYOUT_DEFAULT_FADE } from "./util";

interface Props extends WithChildren, WithClass {}

let {
	//
	children,
	class: class_,
}: Props = $props();

$effect(() => {});
</script>

<div
	class={merge_classes(
		//
		"content-main",
		"relative snap-start",
		"w[100lvw] h-full min-h[100lvh]",
		"flex",
		class_,
	)}
	in:fade={{...LAYOUT_DEFAULT_FADE, delay: 500 }}
	out:fade={LAYOUT_DEFAULT_FADE}
>
	{@render children()}
</div>
