<script lang="ts">
import { merge_classes } from "@xeho91/lib-feature/css/util";
import type { ComponentProps, Snippet } from "svelte";

import type { ParagraphgWeight } from "./util";

import { Text } from "#primitive/text/mod";

interface Props extends Omit<ComponentProps<Text>, "family"> {
	children: Snippet;
	size?: ComponentProps<Text>["size"];
	weight?: ParagraphgWeight;
}

let {
	//
	children,
	class: class_,
	size,
	weight = "medium",
	...rest_props
}: Props = $props();
</script>

<Text
	{...rest_props}
	tag="p"
	class={merge_classes("paragraph", class_)}
	family="serif"
	{weight}
	{size}
>
	{@render children()}
</Text>
