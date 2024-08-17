<script lang="ts">
import "@xeho91/lib-asset/font/sans";
import "@xeho91/lib-asset/font/serif";
import "@xeho91/lib-asset/font/mono";

import { Color } from "@xeho91/lib-design/color";
import { GlobalManagers } from "@xeho91/lib-feature/global";
import { Content, Footer, Header, Main } from "@xeho91/lib-ui/layout/default";
import type { Snippet } from "svelte";

interface Props {
	children: Snippet;
}

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
		{#snippet header(loading)}
			<Header {loading} />
		{/snippet}
		{#snippet content(loading)}
			<Content {loading}>
				{@render children()}
			</Content>
		{/snippet}
		{#snippet footer(loading)}
			<Footer {loading} />
		{/snippet}
	</Main>
</GlobalManagers>
