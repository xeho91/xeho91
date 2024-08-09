<script lang="ts">
import type { Snippet } from "svelte";

import { ManagerCSS } from "#css/mod";

interface Props {
	children: Snippet;
}

let { children }: Props = $props();
</script>

<ManagerCSS />
{@render children()}
