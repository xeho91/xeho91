<script lang="ts">
import IconifyIcon from "@iconify/svelte";
import type { ColorName } from "@xeho91/lib-design/color";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";

import { ICONS_MAP, type IconName } from "./util";

import { Skeleton, set_skeleton_color } from "#primitive/skeleton/mod";

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
	<IconifyIcon
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
	></IconifyIcon>
{/if}
