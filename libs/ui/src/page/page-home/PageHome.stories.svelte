<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import PageHome from "./PageHome.svelte";

import { LayoutDefault } from "#layout/default/mod";

const { Story } = defineMeta({
	...SHARED_META,
	component: PageHome,
	parameters: {
		layout: "fullscreen",
	},
	// @ts-expect-error: FIXME: Need to fix typings on addon
	decorators: [() => ({ Component: LayoutDefault })],
});
</script>

<Story
	name="Default"
	parameters={PARAMETERS.default}
	tags={["!autodocs", "dev"]}
/>
