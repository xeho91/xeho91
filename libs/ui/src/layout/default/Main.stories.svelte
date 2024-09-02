<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import Container from "./Container.svelte";
import Main from "./Main.svelte";

const { Story } = defineMeta({
	...SHARED_META,
	component: Main,
	decorators: [
		() => ({
			// @ts-expect-error FIXME: Need to fix addon
			Component: Container,
		}),
	],
	parameters: {
		layout: "full-screen",
	},
});
</script>

<Story name="Default" parameters={PARAMETERS.default} tags={["!dev"]} />
