<script lang="ts">
import type { WithChildren } from "#component/mod";
import { ManagerCSS } from "#css/mod";

interface Props extends WithChildren {}

let { children }: Props = $props();
</script>

<ManagerCSS />
{@render children()}
