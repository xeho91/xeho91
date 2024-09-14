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

<style>
@layer override {
	:global(body.sb-show-main.sb-main-centered) {
		display: grid !important;
		justify-content: center;
	}

	:global(body.sb-show-main.sb-main-fullscreen) {
		display: revert-layer;
		padding: revert-layer;
	}

	:global(#storybook-root) {
		display: contents;
	}
}
</style>
