<script lang="ts" generics="TOrdered extends boolean = false">
import { merge_classes } from "@xeho91/lib-feature/css";
import type { ComponentProps } from "svelte";

import { Stack } from "#primitive/stack/mod";

type StackTag = TOrdered extends true ? "ol" : "ul";
// TODO: Use `HTMLOLAttributes`
type StackProps = Omit<ComponentProps<Stack<StackTag>>, "tag">;

interface Props extends StackProps {
	ordered?: TOrdered;
}

let {
	//
	children,
	class: class_,
	ordered = false as TOrdered,
	...rest_props
}: Props = $props();

const tag = (ordered ? "ol" : "ul") as StackTag;
</script>

<Stack
	{...rest_props}
	{tag}
	class={merge_classes(
		"list",
		ordered && "ordered",
		class_
	)}
>
	{@render children()}
</Stack>
