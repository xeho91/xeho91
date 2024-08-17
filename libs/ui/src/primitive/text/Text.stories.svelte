<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Font } from "@xeho91/lib-design/font";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Text from "./Text.svelte";

import { Code } from "#semantic/code/mod";

import { TEXT_COLORS, TEXT_HTML_TAGS } from "./util";

const { Story } = defineMeta({
	...SHARED_META,
	component: Text,
	tags: ["autodocs"],
	args: {
		children: "Text",
	},
	argTypes: {
		color: create_control_from_iterable(TEXT_COLORS, {
			category: "design",
			summary: "TextColor",
		}),
		tag: create_control_from_iterable(TEXT_HTML_TAGS, {
			summary: "TextHTMLTag",
		}),
		family: create_control_from_iterable(Font.family.NAMES, {
			category: "design",
			summary: "FontFamilyKey",
		}),
		size: create_control_from_iterable(Font.size.KEYS, {
			category: "design",
			summary: "FontSizeKey",
		}),
		weight: create_control_from_iterable(Font.weight.keys("serif"), {
			category: "design",
			summary: "FontWeightKey",
			/**
			 * TODO:
			 * Use conditional controls once it supports multiple
			 * Ref: https://github.com/storybookjs/storybook/issues/21281
			 */
			if: { arg: "family", truthy: true },
		}),
	},
	parameters: {
		layout: "centered",
	},
});
</script>

<Story name="Playground" parameters={PARAMETERS.playground}>
	{#snippet children(args)}
		<Text {...args}>Text</Text>
	{/snippet}
</Story>

<Story
	name="Default"
	parameters={PARAMETERS.default}
>
	<Text>Default text</Text>
</Story>

<Story
	name="Colors"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="color" values={TEXT_COLORS}>
		{#snippet children({ color })}
			<Text {color}>Text</Text>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Families"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="family" values={Font.family.NAMES}>
		{#snippet children({ family })}
			<Text {family}>Text</Text>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Weights"
	parameters={PARAMETERS.variants}
>
	{#each Font.family.NAMES as family}
		<VariantsGroup prop="weight" values={Font.weight.keys(family)}>
			{#snippet header()}
				<Code>{`family="${family}"`}</Code>
			{/snippet}
			{#snippet children({ weight })}
				<Text {family} {weight}>Text</Text>
			{/snippet}
		</VariantsGroup>
	{/each}
</Story>

<Story
	name="Sizes"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="size" values={Font.size.KEYS}>
		{#snippet children({ size })}
			<Text {size}>Text</Text>
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
				<Text {color} {contrasted}>Text</Text>
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
			<Text {shadow}>Text</Text>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Uppercased"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="uppercased" values={[false, true]}>
		{#snippet children({ uppercased })}
			<Text {uppercased}>Text</Text>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Loading"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="loading" values={[false, true]}>
		{#snippet children({ loading })}
			<Text {loading} class="min-w-[4ch]">Text</Text>
		{/snippet}
	</VariantsGroup>
</Story>
