<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Font } from "@xeho91/lib-design/font";
import { pick } from "@xeho91/lib-snippet/object";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import * as TextStories from "../../primitive/text/Text.stories.svelte";
import Paragraph from "./Paragraph.svelte";

import { TEXT_COLORS } from "#primitive/text/mod";

const { Story } = defineMeta({
	...SHARED_META,
	component: Paragraph,
	tags: ["autodocs"],
	args: {
		children: "Paragraph content",
	},
	argTypes: {
		// @ts-expect-error FIXME: Needs some function wrapper to extract type correctly?
		...pick(TextStories.default.argTypes, ["color", "size"]),
		weight: create_control_from_iterable(Font.weight.keys("sans"), {
			category: "design",
			summary: "ParagraphWeight",
		}),
	},
	parameters: {
		layout: "centered",
	},
});
</script>

<Story
	name="Playground"
	parameters={PARAMETERS.playground}
	tags={["!autodocs", "!dev"]}
/>

<Story
	name="Default"
	parameters={PARAMETERS.default}
	tags={["!dev"]}
/>

<Story
	name="Colors"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="color" values={TEXT_COLORS}>
		{#snippet children({ color })}
			<Paragraph {color}>Paragraph content</Paragraph>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Weights"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="weight" values={Font.weight.keys("mono")}>
		{#snippet children({ weight })}
			<Paragraph {weight}>Paragraph content</Paragraph>
		{/snippet}
	</VariantsGroup>
</Story>


<Story
	name="Sizes"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="size" values={Font.size.KEYS}>
		{#snippet children({ size })}
			<Paragraph {size}>Paragraph content</Paragraph>
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
				<Paragraph>{`color="${color}"`}</Paragraph>
			{/snippet}
			{#snippet children({ contrasted })}
				<Paragraph {color} {contrasted}>Paragraph</Paragraph>
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
		{#snippet children({ shadow })}
			<Paragraph {shadow}>Paragraph content</Paragraph>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Uppercased"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="uppercased" values={[false, true]}>
		{#snippet children({ uppercased })}
			<Paragraph {uppercased}>Paragraph content</Paragraph>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Loading"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="loading" values={[false, true]}>
		{#snippet children({ loading })}
			<Paragraph {loading} class="min-w-[4ch]">Paragraph content</Paragraph>
		{/snippet}
	</VariantsGroup>
</Story>
