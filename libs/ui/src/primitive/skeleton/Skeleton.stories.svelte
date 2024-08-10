<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { create_control_from_iterable, PARAMETERS } from "@xeho91/lib-storybook/arg-type";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import { SKELETON_COLORS, SKELETON_VARIANTS } from "./util";

import Skeleton from "./Skeleton.svelte";

const { Story } = defineMeta({
	component: Skeleton,
	tags: ["autodocs"],
	argTypes: {
		color: create_control_from_iterable(SKELETON_COLORS, {
			summary: "SkeletonColor",
		}),
		variant: create_control_from_iterable(SKELETON_VARIANTS, {
			summary: "SkeletonVariant",
		}),
	},
	parameters: {
		layout: "centered",
	},
});
</script>

<Story name="Playground">
	{#snippet children(args)}
		<Skeleton {...args} />
	{/snippet}
</Story>

<Story name="Default" parameters={PARAMETERS.default}>
	<Skeleton />
</Story>

<Story
	name="Colors"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="color" values={SKELETON_COLORS}>
		{#snippet children({ color })}
			<Skeleton {color} />
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Variants"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="variant" values={SKELETON_VARIANTS}>
		{#snippet children({ variant })}
			<Skeleton {variant} />
		{/snippet}
	</VariantsGroup>
</Story>
