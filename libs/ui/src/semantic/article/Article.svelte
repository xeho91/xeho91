<script lang="ts">
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css/util";
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";

interface Props extends WithClass, Omit<HTMLAttributes<HTMLElement>, "class" | "children"> {
	children: Snippet;
}

let {
	//
	children,
	class: class_,
	...rest_props
}: Props = $props();
</script>

<article
	{...rest_props}
	class={merge_classes(
		"article",
		"min-w[100lvw] min-h[100lvh]",
		"flex place-content-center place-items-center",
		class_
	)}
>
	{@render children()}
</article>
