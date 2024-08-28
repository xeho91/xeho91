<script lang="ts">
import { GlobalManagers } from "@xeho91/lib-feature/global";
import type { Snippet } from "svelte";

interface Props {
	children: Snippet;
}

let { children }: Props = $props();
</script>

<GlobalManagers>
	{@render children()}
</GlobalManagers>
