<script lang="ts">
import { AtLayer, type AtLayerName } from "@xeho91/lib-css/at-rule/layer";
import { Block } from "@xeho91/lib-css/block";
import type { Ruleset } from "@xeho91/lib-css/ruleset";

import { state_css } from "./state.svelte";

interface Props {
	name: AtLayerName;
}

let { name }: Props = $props();

const block = $derived(new Block<Ruleset[]>(...state_css[name]));
const at_layer = $derived(new AtLayer({ name, block }));
</script>

{#if !block.is_empty}
	<svelte:element this={"style"} id={`layer-${name}`}>
		{at_layer}
	</svelte:element>
{/if}
