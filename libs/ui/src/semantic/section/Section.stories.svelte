<script context="module" lang="ts">
import { defineMeta, setTemplate } from "@storybook/addon-svelte-csf";
import { Color } from "@xeho91/lib-design/color";
import { merge_classes } from "@xeho91/lib-feature/css";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import Section from "./Section.svelte";

import { SECTION_HEIGHT, SECTION_WIDTH } from "./util";

import { Root } from "#layout/default/mod";
import { Code } from "#semantic/code/mod";
import { Paragraph } from "#semantic/paragraph/mod";

const { Story } = defineMeta({
	...SHARED_META,
	title: "Semantic/Section",
	component: Section,
	args: {
		id: "example",
		width: "full-grid",
		height: "full-main",
	},
	argTypes: {
		width: create_control_from_iterable(SECTION_WIDTH, { summary: "SectionWidth" }),
		height: create_control_from_iterable(SECTION_HEIGHT, { summary: "SectionHeight" }),
	},
	decorators: [
		// @ts-expect-error FIXME: Need to fix addon types
		() => ({ Component: Root }),
	],
	parameters: {
		layout: "fullscreen",
	},
});
</script>

<script>

setTemplate(template)
</script>

{#snippet template(args)}
	<Section
		{...args}
		class={merge_classes(
			Color.class("background"),
			Color.get("info", "blend", 3).class("background"),
			"col-span-full",
		)}
	>
		<div class="col-span-full self-center justify-self-center">
			{#each ["width", "height"] as size}
				<Paragraph color="info">
					{`${size}:`} <Code>{`"${args[size]}"`}</Code>
				</Paragraph>
			{/each}
		</div>
	</Section>
{/snippet}

<Story
	name="Playground"
	parameters={PARAMETERS.playground}
	tags={["!autodocs", "!dev"]}
/>

<Story
	name="Gutter"
	parameters={PARAMETERS.sample}
	tags={["!dev"]}
	args={{ height: "full-main" }}
>
	{#snippet children(args)}
		<Section {...args}>
			{#each {length: 12} as _, index}
				<div
					class={merge_classes(
						"h-full",
						Color.class("background"),
						Color.get("info", "blend", 8).class("background"),
					)}
				>
					<Code align="center" color="white" class="block w-full">
						{index +  1}
					</Code>
				</div>
			{/each}
		</Section>
	{/snippet}
</Story>

<Story
	name="Widh-Full-grid"
	parameters={PARAMETERS.sample}
	tags={["!dev"]}
	args={{ width: "full-grid" }}
/>

<Story
	name="Width-Full-screen"
	parameters={PARAMETERS.sample}
	tags={["!dev"]}
	args={{ width: "full-screen" }}
/>


<style>
:global(.sb-show-main.sb-main-fullscreen) {
	display: revert-layer;
	padding: revert-layer;
}

@layer override {
	:global(#storybook-root) {
		display: contents;
	}
}
</style>
