<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import { Grid, type GridVariant } from "@xeho91/lib-design/grid";
import type { WithOptionalChildren } from "@xeho91/lib-feature/component";
import { type WithPositionAnchor, type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { Code } from "@xeho91/lib-ui/semantic/code";

interface Props extends WithPositionAnchor, WithOptionalChildren, WithClass {
	variant: GridVariant;
}

let {
	//
	children,
	class: class_,
	variant,
	...rest_props
}: Props = $props();
</script>

<article
	class={merge_classes(
		//
		"justify-self-center",
		"w-full",
		"grid",
		Grid.min.get(variant).class("min-width"),
		Grid.max.get(variant).class("max-width"),
		"grid-cols-12 auto-cols-fr",
		Grid.gutter.get(variant).class("gap"),
		class_
	)}
>
<section
	{...rest_props}
	class={merge_classes(
		//
		"justify-self-center",
		"w-full",
		"grid col-span-full",
		class_
	)}
>
	{#if children}
	{@render children()}
		{:else}
		{#each { length: 12 } as _, index}
			<div
				class={merge_classes("min-h-[33dvh]",
					"flex place-center",
					Color.class("background"),
					Color.get("secondary", "blend", 8).class("background"),
				)}
				>
				<Code size="s" align="center" color="white" class="block w-full">{index + 1}</Code>
			</div>
		{/each}
{/if}
</section>
</article>

<style>
@layer component {
	section {
		grid-template-columns: subgrid;
	}
}
</style>
