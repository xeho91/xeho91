<script context="module" lang="ts">
import { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";

export const LOGOTYPE_DIMENSIONS = new Rectangle(300, 100);
</script>

<script lang="ts">
	import { LogotypeChar } from "#logotype";
	import { set_id } from "#id";

	interface Props {
		id: string;
	}

	let { id }: Props = $props();
</script>

<symbol id={set_id(id, "logotype")}>
	{#each LogotypeChar as name}
		<path
			id={`${id}-char-${name}`}
			d={LogotypeChar[name]?.path_attribute_d}
		/>
	{/each}
</symbol>
