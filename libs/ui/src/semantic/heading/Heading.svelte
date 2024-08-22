<script lang="ts">
import { merge_classes } from "@xeho91/lib-feature/css";
import type { ComponentProps } from "svelte";

import type { HeadingLevel, HeadingWeight } from "./util";

import { Text } from "#primitive/text/mod";

type TextProps = Omit<ComponentProps<Text<"h1", "sans", HeadingWeight>>, "tag" | "family">;

interface Props extends TextProps {
	level: HeadingLevel;
	weight?: HeadingWeight | undefined;
}

let {
	//
	children,
	class: class_,
	level,
	size = "l",
	weight = "medium",
	...rest_props
}: Props = $props();
</script>

<Text
	{...rest_props}
	tag={`h${level}`}
	family="sans"
	{size}
	{weight}
	class={merge_classes("heading", "inline-flex", class_)}
>
	{@render children()}
</Text>

<style>
	@layer component {
		:global(.heading) :global(.icon) {
			margin-inline: 1rex;
		}
	}
</style>
