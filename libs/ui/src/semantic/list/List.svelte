<script lang="ts" context="module">
export type ListHTMLTag = "ol" | "ul";
</script>

<script lang="ts" generics="TTag extends ListHTMLTag = 'ul', TUseGrid extends boolean = false">
import { merge_classes } from "@xeho91/lib-feature/css";
import type { ComponentProps } from "svelte";

import { Stack } from "#primitive/stack/mod";

type StackProps = ComponentProps<Stack<TTag, TUseGrid>>;
type Props = StackProps & {};

let {
	//
	children,
	class: class_,
	tag = "ul" as TTag,
	...rest_props
}: Props = $props();
</script>

<Stack
	{...rest_props}
	{tag}
	class={merge_classes(
		"list",
		class_
	)}
>
	{@render children()}
</Stack>
