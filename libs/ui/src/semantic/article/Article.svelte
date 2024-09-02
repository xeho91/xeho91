<script lang="ts">
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
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
	class={merge_classes("article", "contents", class_)}
>
	{@render children()}
</article>
