<script lang="ts">
import type { ColorName } from "@xeho91/lib-design/color";
import { merge_classes, type WithClass } from "@xeho91/lib-feature/css";

import "iconify-icon";

import { type IconName, ICONS_MAP } from "./util";

import { set_skeleton_color, Skeleton } from "#primitive/skeleton/mod";

interface Props extends WithClass {
	color?: ColorName;
	name: IconName;
	loading?: boolean;
}

let { class: class_, color, name, loading, ...rest_props }: Props = $props();
</script>

{#if loading}
	<Skeleton color={set_skeleton_color(color)} variant="circle" />
{:else}
	<iconify-icon
		{...rest_props}
		class={merge_classes(
			//
			"icon",
			"inline-flex items-center",
			class_,
		)}
		icon={`ph:${ICONS_MAP.get(name)}-duotone`}
		width="1em"
		height="1em"
	>
	</iconify-icon>
{/if}

<style>
	.icon {
		margin-block-end: -0.25ex;
	}
</style>
