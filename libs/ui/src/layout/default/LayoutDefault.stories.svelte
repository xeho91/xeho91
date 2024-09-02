<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import LayoutDefault from "./LayoutDefault.svelte";

const { Story } = defineMeta({
	...SHARED_META,
	component: LayoutDefault,
	parameters: {
		layout: "fullscreen",
	},
});
</script>

<Story name="Preview" parameters={PARAMETERS.default} tags={["!autodocs"]} />
