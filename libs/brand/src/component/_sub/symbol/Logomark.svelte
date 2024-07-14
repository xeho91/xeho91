<script context="module" lang="ts">
import { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";

export const DIMENSIONS_LOGOMARK = new Rectangle(49.45, 59.54);
</script>

<script lang="ts">
	import { LogotypeChar } from "#logotype";
	import { set_id } from "#id";

	interface Props {
		id: string;
	}

	let { id }: Props = $props();
</script>

<symbol id={set_id(id, "logomark")}>
	<path d={LogotypeChar.x.path_attribute_d} />
</symbol>
