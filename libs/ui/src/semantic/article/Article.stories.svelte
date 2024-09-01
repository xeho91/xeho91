<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import Article from "./Article.svelte";

const { Story } = defineMeta({
	...SHARED_META,
	component: Article,
	argTypes: {},
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

<Story name="Default" parameters={PARAMETERS.default} tags={["!dev"]} />
