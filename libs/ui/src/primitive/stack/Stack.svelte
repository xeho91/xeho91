<script lang="ts" generics="TTag extends StackHTMLTag = 'div', TUseGrid extends boolean = false">
import { merge_classes } from "@xeho91/lib-feature/css";
import type { ComponentProps } from "svelte";

import type { StackHTMLTag } from "./util";

import { FlexBox, GridBox } from "#primitive/box/mod";

type FlexBoxProps = ComponentProps<typeof FlexBox<TTag>>;
type GridBoxProps = ComponentProps<typeof GridBox<TTag>>;
type BoxProps = TUseGrid extends true ? GridBoxProps : FlexBoxProps;
type Props = BoxProps & {
	tag?: StackHTMLTag;
	grid?: TUseGrid;
};

let {
	class: class_,
	children,
	grid = false as TUseGrid,
	// Other
	...rest_props
}: Props = $props();
</script>

{#if grid}
	<GridBox
		{...rest_props}
		class={merge_classes(
			"stack",
			class_,
		)}
	>
		{@render children()}
	</GridBox>
{:else}
	<FlexBox
		{...rest_props}
		class={merge_classes(
			"stack",
			class_,
		)}
	>
		{@render children()}
	</FlexBox>
{/if}

