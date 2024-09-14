<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Space } from "@xeho91/lib-design/space";
import { readonly_set } from "@xeho91/lib-snippet/set";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Sample from "./Sample.svelte";
import Stack from "./Stack.svelte";

import { STACK_HTML_TAGS } from "./util";

const directions = readonly_set(["column", "column-reverse", "row", "row-reverse"]);
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
	...SHARED_META,
	component: Stack,
	argTypes: {
		tag: create_control_from_iterable(STACK_HTML_TAGS, {
			summary: "StackHTMLTag",
		}),
		direction: create_control_from_iterable(directions, {
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

<Story
	name="Playground"
	parameters={PARAMETERS.playground}
	tags={["!autodocs", "!dev"]}
>
	{#snippet children(args)}
		<Stack {...args}>
			<Sample />
		</Stack>
	{/snippet}
</Story>

<Story
	name="Default"
	parameters={PARAMETERS.default}
	tags={["!dev"]}
>
	<Stack>
		<Sample />
	</Stack>
</Story>

<Story
	name="Directions"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="direction" values={directions}>
		{#snippet children({ direction })}
			<Stack {direction}>
				<Sample />
			</Stack>
		{/snippet}
	</VariantsGroup>
</Story>
