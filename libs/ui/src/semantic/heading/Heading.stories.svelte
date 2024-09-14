<script context="module" lang="ts">
import { defineMeta, setTemplate } from "@storybook/addon-svelte-csf";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Font } from "@xeho91/lib-design/font";
import { pick } from "@xeho91/lib-snippet/object";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import * as TextStories from "../../primitive/text/Text.stories.svelte";
import Heading from "./Heading.svelte";

import { TEXT_COLORS } from "#primitive/text/mod";

const { Story } = defineMeta({
	...SHARED_META,
	component: Heading,
	args: {
		level: 1,
		children: "Heading content",
	},
	argTypes: {
		// @ts-expect-error FIXME: Needs some function wrapper to extract type correctly?
		...pick(TextStories.default.argTypes, ["color", "size"]),
		weight: create_control_from_iterable(Font.weight.keys("serif"), {
			category: "design",
			summary: "HeadingWeight",
		}),
	},
	parameters: {
		layout: "centered",
	},
});
</script>

<script>
setTemplate(template);
</script>

{#snippet template(args)}
	<Heading {...args}>{args.children}</Heading>
{/snippet}

<Story
	name="Playground"
	parameters={PARAMETERS.playground}
	tags={["!autodocs", "!dev"]}
/>

<Story
	name="Colors"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="color" values={TEXT_COLORS}>
		{#snippet children({ color, level })}
			<!-- TODO: Remove level={2} once types from Storybook are fixed -->
			<Heading {level} {color}>Heading content</Heading>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Weights"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="weight" values={Font.weight.keys("mono")}>
		{#snippet children({ level, weight })}
			<Heading {level} {weight}>Heading content</Heading>
		{/snippet}
	</VariantsGroup>
</Story>


<Story
	name="Sizes"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="size" values={Font.size.KEYS}>
		{#snippet children({ level, size })}
			<Heading {level} {size}>Heading content</Heading>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Contrasts"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	{#each TEXT_COLORS as color}
		<VariantsGroup prop="contrasted" values={[false, true]}>
			{#snippet header()}
				{`color="${color}"`}
			{/snippet}
			{#snippet children({ level, contrasted })}
				<Heading {level} {color} {contrasted}>Heading</Heading>
			{/snippet}
		</VariantsGroup>
	{/each}
</Story>

<Story
	name="Shadows"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="shadow" values={Elevation.LEVELS}>
		{#snippet children({ level, shadow })}
			<!-- TODO: Remove level={2} once types from Storybook are fixed -->
			<Heading {level} {shadow}>Heading content</Heading>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Uppercased"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="uppercased" values={[false, true]}>
		{#snippet children({ level, uppercased })}
			<!-- TODO: Remove level={2} once types from Storybook are fixed -->
			<Heading {level} {uppercased}>Heading content</Heading>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Loading"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="loading" values={[false, true]}>
		{#snippet children({ level, loading })}
			<!-- TODO: Remove level={2} once types from Storybook are fixed -->
			<Heading {level} {loading} class="min-w-[4ch]">Heading content</Heading>
		{/snippet}
	</VariantsGroup>
</Story>
