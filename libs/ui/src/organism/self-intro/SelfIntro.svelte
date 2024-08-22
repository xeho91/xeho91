<script lang="ts">
import { Space } from "@xeho91/lib-design/space";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";

import { CodeJobTitle } from "#atom/code-job-title/mod";
import { ListSocialChannels } from "#molecule/list-social-channels/mod";
import { Heading } from "#semantic/heading/mod";
import { Paragraph } from "#semantic/paragraph/mod";

interface Props extends WithClass {}

let { class: class_ }: Props = $props();
</script>

<div
	class={merge_classes(
		"self-intro",
		"w-fit",
		"flex flex-col items-start",
		class_,
	)}
>
	<Heading
		level={1}
		color="primary"
		size="4xl"
		shadow={1}
		weight="black"
		uppercased
		class={merge_classes("leading-tight")}
	>
		{"Hey stranger!"}
	</Heading>

	<Paragraph size="xl" color="primary">
		{"Call me "}<em>{"Matt"}</em>{","}
	</Paragraph>

	<Paragraph size="l" color="secondary" class={merge_classes("flex-wrap")}>
		{"and I'm a "}
		<CodeJobTitle />
		{" developer."}
	</Paragraph>

	<ListSocialChannels
		class={merge_classes(
			"self-center",
			Space.get("s").class("margin-block-start"),
		)}
	/>
</div>
