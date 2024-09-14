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
import { LayoutDefault } from "@xeho91/lib-ui/layout/default";
import { NavApp, type NavAppLinkData } from "@xeho91/lib-ui/organism/nav-app";
import { onDestroy, onMount, tick } from "svelte";
import { SvelteURL } from "svelte/reactivity";

import { onNavigate } from "$app/navigation";
import { page } from "$app/stores";

interface Props extends WithChildren {}

let { children }: Props = $props();

const links: NavAppLinkData[] = [
	{
		icon: "home",
		href: "/",
		label: "Home",
	},
	{
		icon: "user",
		href: "/about-me",
		label: "About me",
	},
	{
		icon: "contact",
		href: "/contact",
		label: "Contact",
	},
];

let is_mounted = $state(false);
let is_layout_loaded = $state(false);
let slide_direction = $state<"left" | "right">("left");

onMount(async () => {
	await tick();
	is_mounted = true;
	is_layout_loaded = true;
});
onDestroy(async () => {
	is_mounted = false;
	is_layout_loaded = false;
	await tick();
});
onNavigate((navigation) => {
	if (!document.startViewTransition) return;
	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			is_layout_loaded = false;
			const index_of_from = links.findIndex((l) => l.href === navigation.from?.url.pathname);
			const index_of_to = links.findIndex((l) => l.href === navigation.to?.url.pathname);
			const main = window.document.getElementsByTagName("main")[0];
			main?.classList.remove(slide_direction);
			slide_direction = index_of_to > index_of_from ? "left" : "right";
			main?.classList.add(slide_direction);
			await tick();
			await navigation.complete;
			await tick();
			is_layout_loaded = true;
		});
	});
});
</script>

<svelte:head>
	{#each Color.SCHEMES as scheme}
		<meta
			name="theme-color"
			content={Color.get("secondary", "opaque", 9)[scheme].oklch.toString()}
			media={`(prefers-color-scheme: ${scheme})`}
		/>
	{/each}
</svelte:head>

<GlobalManagers>
	{#if is_mounted}
		<LayoutDefault>
			{#if is_layout_loaded}
				{@render children()}
			{/if}
			{#snippet nav(classes)}
				<NavApp
					{links}
					current={new SvelteURL($page.url)}
					class={classes}
				/>
			{/snippet}
		</LayoutDefault>
	{/if}
</GlobalManagers>
