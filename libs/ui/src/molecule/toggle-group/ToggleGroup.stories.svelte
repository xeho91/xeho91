<script context="module" lang="ts">
import { action } from "@storybook/addon-actions";
import { defineMeta, setTemplate } from "@storybook/addon-svelte-csf";
import { Color } from "@xeho91/lib-design/color";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import ToggleGroup from "./ToggleGroup.svelte";
import { TOGGLE_GROUP_COLORS } from "./util.svelte";

import { Icon } from "#primitive/icon/mod";

const { Story } = defineMeta({
	...SHARED_META,
	component: ToggleGroup,
	title: "Molecule/ToggleGroup",
	tags: ["autodocs"],
	args: {
		entries: [
			{ label: "light", value: "light" },
			{ label: "system", value: "system" },
			{ label: "dark", value: "dark" },
		],
		name: "color-scheme",
		onchange: action("onchange", { allowUndefined: true }),
		resettable: false,
	},
	argTypes: {
		color: create_control_from_iterable(TOGGLE_GROUP_COLORS, { category: "design", summary: "ToggleGroupColor" }),
	},
	parameters: {
		layout: "centered",
	},
});
</script>

<script>
	setTemplate(template);

	const icon_map = {
		"light": "sun",
		"system": "monitor",
		"dark": "moon",
	};
</script>

{#snippet template(args)}
	<ToggleGroup {...args}>
		{#snippet children(value)}
			<Icon name={icon_map[value]} />
		{/snippet}
	</ToggleGroup>
{/snippet}

<Story name="Playground" parameters={PARAMETERS.playground} />

<Story
	name="Colors"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="color" values={TOGGLE_GROUP_COLORS}>
		{#snippet children({ color })}
			<ToggleGroup
				name={`color-${color}`}
				entries={[...Color.SCHEMES].map((value) => ({ label: value, value }))}
				{color}
			>
				{#snippet children(value, _state)}
					<Icon name={value === "light" ? "sun" : "moon"} />
				{/snippet}
			</ToggleGroup>
		{/snippet}
	</VariantsGroup>
</Story>
