<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Radius } from "@xeho91/lib-design/radius";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Sample from "./Sample.svelte";

export const { Story, meta } = defineMeta({
	...SHARED_META,
	title: "design token/Radius",
	component: Sample,
	tags: ["autodocs"],
	args: {},
	argTypes: {
		size: create_control_from_iterable(Radius, {
			summary: "RadiusSize",
		}),
	},
	parameters: {
		actions: { disable: false },
		layout: "centered",
	},
});
</script>

<Story
	name="Playground"
	parameters={PARAMETERS.playground}
	tags={["!autodocs", "!dev"]}
>
	{#snippet children(args)}
		<Sample {...args} />
	{/snippet}
</Story>

<Story
	name="Sizes"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="size" values={Radius}>
		{#snippet children({ size })}
			<Sample {size} />
		{/snippet}
	</VariantsGroup>
</Story>
