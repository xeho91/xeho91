<script lang="ts">
// FIXME: Workaround because at build time Vite's optimization removes the fonts-related css import
import "@fontsource-variable/work-sans/wght.css";
import "@fontsource-variable/work-sans/wght-italic.css";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "@fontsource-variable/jetbrains-mono/wght-italic.css";

import { Color } from "@xeho91/lib-design/color";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { GlobalManagers } from "@xeho91/lib-feature/global";
import { Content, Footer, Header, Main } from "@xeho91/lib-ui/layout/default";

interface Props extends WithChildren {}

let { children }: Props = $props();
</script>

<svelte:head>
	{#each Color.SCHEMES as scheme}
		<meta
			name="theme-color"
			content={Color.get("secondary", "solid", 9).light_dark[scheme].oklch.toString()}
			media={`(prefers-color-scheme: ${scheme})`}
		/>
	{/each}
</svelte:head>

<GlobalManagers>
	<Main>
		{#snippet header()}
			<Header />
		{/snippet}
		{#snippet content()}
			<Content>
				{@render children()}
			</Content>
		{/snippet}
		{#snippet footer()}
			<Footer />
		{/snippet}
	</Main>
</GlobalManagers>
