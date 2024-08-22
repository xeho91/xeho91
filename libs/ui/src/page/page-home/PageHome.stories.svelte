<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import PageHome from "./PageHome.svelte";

const { Story } = defineMeta({
	...SHARED_META,
	component: PageHome,
	tags: ["autodocs"],
	argTypes: {},
	parameters: {
		layout: "fullscreen",
	},
});
</script>

<Story name="Default" parameters={PARAMETERS.default} />
