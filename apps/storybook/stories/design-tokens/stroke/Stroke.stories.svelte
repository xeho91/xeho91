<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Stroke } from "@xeho91/lib-design/stroke";
import { PARAMETERS, create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Sample from "./Sample.svelte";

export const { Story, meta } = defineMeta({
	title: "Design tokens/Stroke",
	component: Sample,
	tags: ["autodocs"],
	args: {},
	argTypes: {
		size: create_control_from_iterable(Stroke, {
			summary: "StrokeSize",
		}),
	},
	parameters: {
		actions: { disable: false },
		layout: "centered",
	},
});
</script>


<Story name="Playground" parameters={PARAMETERS.playground}>
	{#snippet children(args)}
		<Sample {...args} />
	{/snippet}
</Story>

<Story
	name="Sizes"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="size" values={Stroke}>
		{#snippet children({ size })}
			<Sample {size} />
		{/snippet}
	</VariantsGroup>
</Story>
