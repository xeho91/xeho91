<script lang="ts">
	import { AtLayer, type AtLayerName } from "@xeho91/lib-css/at-rule/layer";
	import { RulesetsList } from "@xeho91/lib-css/rulesets-list";

	import { state_css } from "./state.svelte";

	interface Props {
		name: AtLayerName;
	}
	let {
		//
		name,
	}: Props = $props();

	const rulesets = $derived(new RulesetsList(...state_css[name]));
	// TODO: Use AtLayer
</script>

{#if !rulesets.is_empty}
	<svelte:element this={"style"} id={`layer-${name}`}>
		{`@layer ${name} {`}
		{#each rulesets as ruleset}
			{ruleset}
		{/each}
		{`}`}
	</svelte:element>
{/if}
