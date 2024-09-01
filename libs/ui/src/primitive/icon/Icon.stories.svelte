<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Icon from "./Icon.svelte";

import { ICONS_MAP } from "./util";

const { Story } = defineMeta({
	...SHARED_META,
	component: Icon,
	args: {
		name: "heart",
	},
	argTypes: {
		name: create_control_from_iterable(ICONS_MAP.keys(), {
			summary: "IconName",
		}),
	},
	parameters: {
		actions: { disable: true },
		layout: "centered",
	},
});
</script>

<Story
	name="Playground"
	parameters={PARAMETERS.playground}
	tags={["!autodocs", "!dev"]}
/>

<Story
	name="Names"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="name" values={ICONS_MAP.keys()}>
		{#snippet children({ name })}
			<Icon {name} />
		{/snippet}
	</VariantsGroup>
</Story>
