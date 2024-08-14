<script lang="ts">
import "@xeho91/lib-asset/font/sans";
import "@xeho91/lib-asset/font/serif";
import "@xeho91/lib-asset/font/mono";

import { Logo } from "@xeho91/lib-brand/logo";
import { Color } from "@xeho91/lib-design/color";
import { merge_classes } from "@xeho91/lib-feature/css";
import { GlobalManagers } from "@xeho91/lib-feature/global";
import type { Snippet } from "svelte";

interface Props {
	children: Snippet;
}

let { children }: Props = $props();
</script>

<svelte:head>
	<meta
		name="theme-color"
		content={Color.get("secondary", "solid", 9).light_dark.light.oklch.toString()}
		media="(prefers-color-scheme: light)"
	/>
	<meta
		name="theme-color"
		content={Color.get("secondary", "solid", 9).light_dark.dark.oklch.toString()}
		media="(prefers-color-scheme: dark)"
	/>
</svelte:head>

<GlobalManagers>
	<main
		class={merge_classes(
			//
			"flex flex-col",
			"size-full",
			"place-content-center",
		)}
	>
		<header>
			<Logo animated />
		</header>

		{@render children()}
	</main>
</GlobalManagers>
