<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { expect, waitFor, within } from "@storybook/test";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import Header from "./Header.svelte";

const { Story } = defineMeta({
	...SHARED_META,
	component: Header,
	parameters: {
		layout: "fullscreen",
	},
});
</script>

<Story name="Default" parameters={PARAMETERS.default} tags={["!dev"]} />
