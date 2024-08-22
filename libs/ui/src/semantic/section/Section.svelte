<script lang="ts">
import { type WithAnchor, type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { WithChildren } from "@xeho91/lib-feature/component";
import type { HTMLAttributes } from "svelte/elements";

interface Props extends WithAnchor, WithChildren, WithClass, Omit<HTMLAttributes<HTMLElement>, "class" | "children"> {}

let {
	//
	children,
	class: class_,
	...rest_props
}: Props = $props();
</script>

<section
	{...rest_props}
	class={merge_classes(
		//
		"section",
		class_
	)}
>
	{@render children()}
</section>
