<script context="module" lang="ts">
import { action } from "@storybook/addon-actions";
import { type Args, defineMeta, setTemplate } from "@storybook/addon-svelte-csf";
import { expect, fireEvent, userEvent, waitFor, within } from "@storybook/test";
import { unreachable } from "@xeho91/lib-error/unreachable";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Button from "./Button.svelte";

import { BUTTON_COLORS, BUTTON_SIZES, BUTTON_VARIANTS } from "./util";

import { Icon } from "#primitive/icon/mod";
import { Stack } from "#primitive/stack/mod";

const { Story } = defineMeta({
	...SHARED_META,
	component: Button,
	tags: ["autodocs"],
	args: {
		onblur: action("onblur"),
		onclick: action("onclick"),
		onfocus: action("onfocus"),
		onmouseover: action("onmouseover"),
		onmouseout: action("onmouseout"),
	},
	argTypes: {
		color: create_control_from_iterable(BUTTON_COLORS, {
			summary: "ButtonColor",
			category: "design",
		}),
		size: create_control_from_iterable(BUTTON_SIZES, {
			summary: "ButtonSize",
			category: "design",
		}),
		variant: create_control_from_iterable(BUTTON_VARIANTS, {
			summary: "ButtonVariant",
			category: "design",
		}),
	},
	parameters: {
		actions: { disable: false },
		layout: "centered",
	},
});
</script>

<script>
	setTemplate(template);
</script>

<!-- TODO: Use Args<typeof Story> once types are fixed -->
{#snippet template(args)}
	<Button {...args}>{"Button"}</Button>
{/snippet}

<Story name="Playground" parameters={PARAMETERS.playground} />

<Story
	name="Default"
	parameters={PARAMETERS.default}
	play={async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getAllByRole("button")[0];
		if (!button) throw unreachable();
		await Promise.all([
			fireEvent.blur(button),
			userEvent.click(button),
			fireEvent.focus(button),
			userEvent.hover(button),
			userEvent.unhover(button),
		]);
		await Promise.all([
			waitFor(() => expect(args.onblur).toHaveBeenCalled()),
			waitFor(() => expect(args.onclick).toHaveBeenCalled()),
			waitFor(() => expect(args.onfocus).toHaveBeenCalled()),
			waitFor(() => expect(args.onmouseout).toHaveBeenCalled()),
			waitFor(() => expect(args.onmouseover).toHaveBeenCalled()),
		]);
	}}
/>

<Story
	name="Variants"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup component={Button} prop="variant" values={BUTTON_VARIANTS}>
		{#snippet children({ variant })}
			<Button {variant}>
				{"Button"}
			</Button>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Colors"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="color" values={BUTTON_COLORS}>
		{#snippet children({ color })}
			{#each BUTTON_VARIANTS as variant}
				<Button {variant} {color}>
					{"Button"}
				</Button>
			{/each}
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Sizes"
	parameters={PARAMETERS.variants}
>
	<VariantsGroup prop="size" values={BUTTON_SIZES}>
		{#snippet children({ size })}
			<Button {size}>Button</Button>
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Icon only"
	parameters={PARAMETERS.variants}
>
	<Stack direction="column" align_items="center" gap="2xs">
		{#each BUTTON_SIZES as size}
			<Stack gap="2xs">
				{#each BUTTON_VARIANTS as variant}
					<Button {variant} {size}>
						<Icon name="heart" />
					</Button>
				{/each}
			</Stack>
		{/each}
	</Stack>
</Story>

<Story
	name="With Icon"
	parameters={PARAMETERS.variants}
>
<Stack direction="column" gap_row="s">
	<Button>
		<Icon name="heart" />
		Button
	</Button>
	<Button>
		Button
		<Icon name="heart" />
	</Button>
	</Stack>
</Story>
