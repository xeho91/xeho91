<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Elevation } from "@xeho91/lib-design/elevation";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Sample from "./Sample.svelte";

export const { Story, meta } = defineMeta({
	...SHARED_META,
	title: "Design tokens/Elevation",
	component: Sample,
	tags: ["autodocs"],
	args: {},
	argTypes: {
		level: create_control_from_iterable(Elevation, {
			summary: "ElevationLevel",
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
	name="Levels"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="level" values={Elevation}>
		{#snippet children({ level })}
			<Sample {level} />
		{/snippet}
	</VariantsGroup>
</Story>
