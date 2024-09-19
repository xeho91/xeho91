<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import Article from "./Article.svelte";

import { Root } from "#layout/default/mod";

const { Story } = defineMeta({
	...SHARED_META,
	title: "Semantic/Article",
	component: Article,
	decorators: [
		() => ({
			// @ts-expect-error FIXME: Need to fix addon
			Component: Root,
		}),
	],
	argTypes: {},
	parameters: {
		layout: "centered",
	},
});
</script>

<Story
	name="Playground"
	parameters={PARAMETERS.playground}
	tags={["autodocs", "!dev"]}
/>
