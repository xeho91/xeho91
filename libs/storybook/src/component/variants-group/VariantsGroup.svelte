<script lang="ts" generics="TComponent extends Component<any>, TPropName extends keyof ComponentProps<TComponent>, TValue extends ComponentProps<TComponent>[TPropName]">
import { Color } from "@xeho91/lib-design/color";
import { Space } from "@xeho91/lib-design/space";
import { Stroke } from "@xeho91/lib-design/stroke";
import { classes, merge_classes, type WithClass } from "@xeho91/lib-feature/css";
import { Icon } from "@xeho91/lib-ui/primitive/icon";
import { List, Item } from "@xeho91/lib-ui/semantic/list";
import { Heading } from "@xeho91/lib-ui/semantic/heading";
import type { ComponentProps, Snippet, Component } from "svelte";

import Variant from "./Variant.svelte";

type OmittedComponentProps = Omit<ComponentProps<TComponent>, TPropName | "children" | "class">;

type Props = OmittedComponentProps &
	WithClass & {
		component?: TComponent;
		children?: Snippet<[ComponentProps<TComponent>]>;
		prop: TPropName;
		values: Iterable<TValue>;
		header?: Snippet;
	};

const {
	//
	component,
	children,
	class: class_,
	header,
	prop,
	values,
	...rest_props
}: Props = $props();
</script>

<div
	use:classes={[
		"variants-group",
		"flex",
		"w-full min-h-[fit-content]",
		Stroke.get("s").class(),
		Color.class("background"),
		Color.get("grayscale", "gray", "solid", 2).class("background"),
		Color.class("border"),
		Color.get("grayscale", "gray", "solid", 6).class("border"),
		class_,
	]}
>

	{#if header}
		<header
			use:classes={[
				"size-full",
				"flex",
				Space.get("s").class("padding-inline"),
				Space.get("3xs").class("padding-block"),
				Color.class("background"),
				Color.get("brand", "primary", "solid", 3).class("background"),
				"border-solid",
				Stroke.get("xs").class("bottom"),
				Color.class("border-bottom"),
				Color.get("grayscale", "gray", "solid", 6).class("border-bottom"),
			]}
		>
			<Heading level={2} color="primary" size="m">
				<Icon name="shield" />
					{@render header()}
			</Heading>
		</header>
{/if}

	<List
		direction="column"
		padding_x="2xs"
		padding_y="3xs"
		class={merge_classes(
			"w-full",
			"self-center",
		)}
	>
		{#each values as value}
			<Item
				padding_y="xs"
				class={merge_classes(
					"border-dashed",
					Stroke.get("xs").class("block-start"),
					"border-y-0",
					Color.class("border-block-start"),
					Color.get("grayscale", "gray", "blend", 6).class("border-block-start"),
				)}
			>
				<Variant {prop} {value}>
					{@const args = { ...rest_props, [prop]: value } as unknown as ComponentProps<TComponent>}
					{#if children}
						{@render children(args)}
					{:else if component}
						<svelte:component this={component} {...args as ComponentProps<TComponent>} />
					{/if}
				</Variant>
			</Item>
		{/each}
	</List>
</div>

<style>
:global(.variants-group) {
	:global(.item:first-of-type) {
		border-block-start: none;
	}

}
</style>
