<script context="module" lang="ts">
import { defineMeta, setTemplate } from "@storybook/addon-svelte-csf";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Popover from "./Popover.svelte";
import { POPOVER_COLORS } from "./util";

import { Text } from "#primitive/text/mod";
import { Button } from "#semantic/button/mod";

const { Story } = defineMeta({
	...SHARED_META,
	component: Popover,
	args: {
		id: "example-popover",
		// @ts-expect-error FIXME: Upstream issue
		children: "Popover content",
	},
	parameters: {
		layout: "centered",
	},
});
</script>

<script>
setTemplate(template);
</script>

{#snippet template(args, context)}
	<Button size="small" popovertarget={context.name}>
		{"Show popover"}
	</Button>
	<Popover  {...args} id={context.name}>
		{#snippet children(color)}
			<Text {color}>
				{args.children}
			</Text>
		{/snippet}
	</Popover>
{/snippet}

<Story
	name="Playground"
	parameters={PARAMETERS.playground}
	tags={["!autodocs", "!dev"]}
/>

<Story
	name="Auto"
	parameters={PARAMETERS.sample}
	tags={["autodocs", "!dev"]}
	args={{ type: "auto" }}
/>

<Story
	name="Manual"
	parameters={PARAMETERS.sample}
	tags={["!dev"]}
	args={{ type: "manual" }}
/>

<Story
	name="Backdropped"
	parameters={PARAMETERS.sample}
	tags={["!dev"]}
	args={{ backdropped: true }}
/>

<Story
	name="Colors"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="color" values={POPOVER_COLORS}>
		{#snippet children({ color })}
			<Button {color} size="small" popovertarget={color}>
				{"Show popover"}
			</Button>
			<Popover id={color} {color} backdropped>
				{#snippet children(color)}
					<Text {color}>
						{`Popover ${color}`}
					</Text>
				{/snippet}
			</Popover>
		{/snippet}
	</VariantsGroup>
</Story>
