<script lang="ts">
import { AtLayer, type AtLayerName } from "@xeho91/lib-css/at-rule/layer";
import { Block } from "@xeho91/lib-css/block";
import type { Ruleset } from "@xeho91/lib-css/ruleset";

import { STATE_CSS } from "./state.svelte";

interface Props {
	name: AtLayerName;
}

let { name }: Props = $props();

const rulesets = $derived(STATE_CSS[name]);
const block = $derived(new Block<Ruleset[]>(...(rulesets ?? [])));
const at_layer = $derived(new AtLayer({ name, block }));
</script>

{#if !block.is_empty}
	<svelte:element this={"style"} id={`layer-${name}`}>
		{at_layer}
	</svelte:element>
{/if}
