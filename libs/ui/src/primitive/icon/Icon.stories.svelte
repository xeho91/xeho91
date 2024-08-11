<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Icon from "./Icon.svelte";

import { ICONS_MAP } from "./util";

const { Story } = defineMeta({
	component: Icon,
	tags: ["autodocs"],
	args: {
		name: "heart",
	},
	argTypes: {
		name: create_control_from_iterable(ICONS_MAP.keys(), {
			summary: "IconName",
		}),
	},
	parameters: {
		actions: { disable: true },
		layout: "centered",
	},
});
</script>

<Story name="Playground">
	{#snippet children(args)}
		<Icon {...args} />
	{/snippet}
</Story>

<Story
	name="Names"
	parameters={{
		controls: { disable: true },
		layout: "fullscreen",
	}}
>
	<VariantsGroup prop="name" values={ICONS_MAP.keys()}>
		{#snippet children({ name })}
			<Icon {name} />
		{/snippet}
	</VariantsGroup>
</Story>
