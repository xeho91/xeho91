<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Space } from "@xeho91/lib-design/space";
import { PARAMETERS, create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Sample from "./Sample.svelte";
import Stack from "./Stack.svelte";

import { STACK_DIRECTIONS, STACK_HTML_TAGS } from "./util";

const align_items = [
	//
	"center",
	"start",
	"end",
	"baseline",
	"stretch",
] as const;
const gap_props = [
	//
	"gap",
	"gap_column",
	"gap_row",
] as const;
const padding_props = [
	"padding",
	"padding_x",
	"padding_x_start",
	"padding_x_end",
	"padding_y",
	"padding_y_start",
	"padding_y_end",
] as const;
const margin_props = [
	"margin",
	"margin_x",
	"margin_x_start",
	"margin_x_end",
	"margin_y",
	"margin_y_start",
	"margin_y_end",
] as const;

const { Story } = defineMeta({
	component: Stack,
	tags: ["autodocs"],
	argTypes: {
		tag: create_control_from_iterable(STACK_HTML_TAGS, {
			summary: "StackHTMLTag",
		}),
		direction: create_control_from_iterable(STACK_DIRECTIONS, {
			summary: "StackDirection",
		}),
		align_items: create_control_from_iterable(align_items),
		...Object.fromEntries(
			[...gap_props, ...padding_props, ...margin_props].map((prop_name) => [
				[prop_name],
				create_control_from_iterable(Space),
			]),
		),
	},
	parameters: {
		layout: "centered",
	},
});
</script>

<Story name="Playground">
	{#snippet children(args)}
		<Stack {...args}>
			<Sample />
		</Stack>
	{/snippet}
</Story>

<Story
	name="Default"
	parameters={PARAMETERS.default}
>
	<Stack>
		<Sample />
	</Stack>
</Story>

<Story
	name="Directions"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="direction" values={STACK_DIRECTIONS}>
		{#snippet children({ direction })}
			<Stack {direction}>
				<Sample />
			</Stack>
		{/snippet}
	</VariantsGroup>
</Story>
