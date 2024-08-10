<script lang="ts" generics="TComponent extends Component<any>, TPropName extends keyof ComponentProps<TComponent>, TValue extends ComponentProps<TComponent>[TPropName]">
import { Color } from "@xeho91/lib-design/color";
import { Space } from "@xeho91/lib-design/space";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { Component, ComponentProps, Snippet } from "svelte";

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
	class={merge_classes(
		"variants-group",
		"flex flex-col",
		"w-full min-h-[fit-content]",
		Stroke.get("s").class(),
		Color.class("background"),
		Color.get("gray", "solid", 2).class("background"),
		Color.class("border"),
		Color.get("gray", "solid", 6).class("border"),
		class_,
	)}
>

	{#if header}
		<header
			class={merge_classes(
				"flex flex-row",
				"size-full",
				Space.get("s").class("padding-inline"),
				Space.get("3xs").class("padding-block"),
				Color.class("background"),
				Color.get("primary", "solid", 3).class("background"),
				"border-solid",
				Stroke.get("xs").class("bottom"),
				Color.class("border-bottom"),
				Color.get("gray", "solid", 6).class("border-bottom"),
			)}
		>
			{@render header()}
		</header>
	{/if}

	<ul
		class={merge_classes(
			"flex",
			"flex-col",
			"self-center",
			"w-full",
			Space.get("2xs").class("padding-inline"),
			Space.get("3xs").class("padding-block"),
		)}
	>
		{#each values as value}
			<li
				class={merge_classes(
					Space.get("xs").class("padding"),
					"border-dashed",
					Stroke.get("xs").class("block-start"),
					"border-y-0",
					Color.class("border-block-start"),
					Color.get("gray", "blend", 6).class("border-block-start"),
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
			</li>
		{/each}
	</ul>
</div>

<style>
	.variants-group {
		& li:first-of-type {
			border-block-start: none;
		}
	}
</style>
