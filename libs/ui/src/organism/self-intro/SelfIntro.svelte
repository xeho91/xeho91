<script lang="ts">
import { merge_classes } from "@xeho91/lib-feature/css";
import type { ComponentProps } from "svelte";

import { CodeJobTitle } from "#atom/code-job-title/mod";
import { Stack } from "#primitive/stack/mod";
import { Heading } from "#semantic/heading/mod";
import { Paragraph } from "#semantic/paragraph/mod";

type StackProps = Omit<ComponentProps<Stack>, "children" | "direction" | "gap_row" | "align_items">;
interface Props extends StackProps {}

let { class: class_, ...rest_props }: Props = $props();
</script>

<Stack
	{...rest_props}
	direction="column"
	gap_row="3xs"
	align_items="start"
	class={merge_classes(
		//
		"self-intro",
		"size-fit",
		class_,
	)}
>
	<Heading
		level={1}
		color="primary"
		nowrap
		size="3xl"
		shadow={1}
		weight="black"
		uppercased
		class={merge_classes("h-fit", "leading-tight")}
	>
		{"Hey stranger!"}
	</Heading>

	<Paragraph
		size="xl"
		color="primary"
		class={merge_classes("sub-heading", "h-fit")}
	>
		{"Call me "}<em>{"Matt"}</em>{","}
	</Paragraph>

	<Paragraph
		size="l"
		color="secondary"
		class={merge_classes("job-title flex-wrap")}
	>
		{"and I'm a "}
		<CodeJobTitle />
		{" developer."}
	</Paragraph>
</Stack>

<style>
	@layer component {
		:global(.self-intro) {
			@container article (width > 768px) {
				inset-area: inline-end center;
			}
			@container article (width <= 768px) {
				inset-area: block-start center;
			}
		}
	}
</style>
