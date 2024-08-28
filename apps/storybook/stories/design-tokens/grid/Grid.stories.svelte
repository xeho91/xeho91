<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Grid } from "@xeho91/lib-design/grid";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import Sample from "./Sample.svelte";

export const { Story, meta } = defineMeta({
	...SHARED_META,
	title: "Design tokens/Grid",
	component: Sample,
	tags: ["autodocs"],
	args: {
		variant: "default",
	},
	argTypes: {
		variant: create_control_from_iterable(Grid, {
			summary: "GridSize",
		}),
	},
	parameters: {
		actions: { disable: false },
		layout: "fullscreen",
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
	name="Default"
	parameters={PARAMETERS.sample}
	args={{ variant: "default" }}
	tags={["!dev"]}
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
