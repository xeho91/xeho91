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
import Code from "./Code.svelte";

import { TEXT_COLORS } from "#primitive/text/mod";

const { Story } = defineMeta({
	...SHARED_META,
	component: Code,
	tags: ["autodocs"],
	args: {
		children: "Code content",
	},
	argTypes: {
		// @ts-expect-error FIXME: Needs some function wrapper to extract type correctly?
		...pick(TextStories.default.argTypes, ["color", "size"]),
		weight: create_control_from_iterable(Font.weight.keys("serif"), {
			category: "design",
			summary: "CodeWeight",
		}),
	},
	parameters: {
		layout: "centered",
	},
});
</script>

<Story name="Playground" parameters={PARAMETERS.playground} />

<Story name="Default" parameters={PARAMETERS.default} />

<Story
	name="Colors"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="color" values={TEXT_COLORS}>
		{#snippet children({ color })}
			<Code {color}>Code content</Code>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Weights"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="weight" values={Font.weight.keys("mono")}>
		{#snippet children({ weight })}
			<Code {weight}>Code content</Code>
		{/snippet}
	</VariantsGroup>
</Story>


<Story
	name="Sizes"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="size" values={Font.size.KEYS}>
		{#snippet children({ size })}
			<Code {size}>Code content</Code>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Contrasts"
	parameters={PARAMETERS.variants}
>
	{#each TEXT_COLORS as color}
		<VariantsGroup prop="contrasted" values={[false, true]}>
			{#snippet header()}
				<Code>{`color="${color}"`}</Code>
			{/snippet}
			{#snippet children({ contrasted })}
				<Code {color} {contrasted}>Code</Code>
			{/snippet}
		</VariantsGroup>
	{/each}
</Story>

<Story
	name="Shadows"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="shadow" values={Elevation.LEVELS}>
		{#snippet children({ shadow })}
			<Code {shadow}>Code content</Code>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Uppercased"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="uppercased" values={[false, true]}>
		{#snippet children({ uppercased })}
			<Code {uppercased}>Code content</Code>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Loading"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="loading" values={[false, true]}>
		{#snippet children({ loading })}
			<Code {loading} class="min-w-[4ch]">Code content</Code>
		{/snippet}
	</VariantsGroup>
</Story>
