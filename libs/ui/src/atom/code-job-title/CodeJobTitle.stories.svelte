<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import CodeJobTitle from "./CodeJobTitle.svelte";

const { Story } = defineMeta({
	...SHARED_META,
	component: CodeJobTitle,
	title: "Atom/CodeJobTitle",
	parameters: {
		layout: "centered",
	},
});
</script>

<Story name="Default" parameters={PARAMETERS.default} tags={["!dev"]} />
