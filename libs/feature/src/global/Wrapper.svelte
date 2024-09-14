<script lang="ts">
import { onDestroy, onMount, tick } from "svelte";

import type { WithChildren } from "#component/mod";
import { ManagerCSS } from "#css/mod";
import { ManagerScroll } from "#scroll/mod";

interface Props extends WithChildren {}

let { children }: Props = $props();

let is_mounted = $state(false);

onMount(async () => {
	await tick();
	is_mounted = true;
});
onDestroy(async () => {
	await tick();
	is_mounted = false;
});
</script>


<ManagerCSS />
<ManagerScroll />
{#if is_mounted}
	{@render children()}
{/if}
