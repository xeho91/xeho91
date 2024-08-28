<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Font } from "@xeho91/lib-design/font";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";
import { Text } from "@xeho91/lib-ui/primitive/text";
import { Code } from "@xeho91/lib-ui/semantic/code";

export const { Story, meta } = defineMeta({
	...SHARED_META,
	component: Text,
	title: "design token/Font",
	tags: ["autodocs"],
	args: {
		children: "Typography",
	},
	argTypes: {
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

<Story
	name="Playground"
	parameters={PARAMETERS.playground}
	tags={["!autodocs", "!dev"]}
>
	{#snippet children({ args })}
		<Text {...args}>Typography</Text>
	{/snippet}
</Story>

<Story
	name="Families"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="family" values={Font.family.NAMES}>
		{#snippet children({ family })}
			<Text {family}>Font family</Text>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Weights"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	{#each Font.family.NAMES as family}
		<VariantsGroup prop="weight" values={Font.weight.keys(family)}>
			{#snippet header()}
				<Code>{`family="${family}"`}</Code>
			{/snippet}
			{#snippet children({ weight })}
				<Text {family} {weight}>Font weight</Text>
			{/snippet}
		</VariantsGroup>
	{/each}
</Story>

<Story
	name="Sizes"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="size" values={Font.size.KEYS}>
		{#snippet children({ size })}
			<Text {size}>Font size</Text>
		{/snippet}
	</VariantsGroup>
</Story>
