<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Color } from "@xeho91/lib-design/color";
import { PARAMETERS, create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";
import { Stack } from "@xeho91/lib-ui/primitive/stack";
import { Item, List } from "@xeho91/lib-ui/semantic/list";

import Sample from "./Sample.svelte";

const { Story } = defineMeta({
	component: Sample,
	title: "Design tokens/Color",
	tags: ["autodocs"],
	args: {
		name: "primary",
	},
	argTypes: {
		name: create_control_from_iterable(Color.NAMES, {
			summary: "ColorName",
		}),
		step: create_control_from_iterable(Color.STEPS, {
			summary: "ColorStep",
		}),
		type: create_control_from_iterable(Color.TYPES, {
			summary: "ColorType",
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
	name="Palette"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="name" values={Color.NAMES}>
		{#snippet children({ name })}
				<Stack direction="column" gap_row="2xs">
					{#each Color.TYPES as type}
						<List ordered gap_column="3xs">
							{#each Color.STEPS as step}
								<Item>
									<Sample {name} {type} {step} />
								</Item>
							{/each}
						</List>
					{/each}
				</Stack>
		{/snippet}
	</VariantsGroup>
</Story>
