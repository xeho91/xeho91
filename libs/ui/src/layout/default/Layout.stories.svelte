<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import Layout from "./Layout.svelte";

const { Story } = defineMeta({
	...SHARED_META,
	title: "Layout/Default",
	component: Layout,
	parameters: {
		layout: "fullscreen",
	},
});
</script>

<Story name="Preview" parameters={PARAMETERS.default} tags={["!autodocs"]} />
