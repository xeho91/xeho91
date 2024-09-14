<script lang="ts" context="module">
import { action } from "@storybook/addon-actions";
import { defineMeta } from "@storybook/addon-svelte-csf";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { SvelteURL } from "svelte/reactivity";

import NavApp from "./NavApp.svelte";

import { Container } from "#layout/default/mod";

let current = $state(new SvelteURL(window.location.toString()));

current.pathname = "/";

const { Story } = defineMeta({
	...SHARED_META,
	component: NavApp,
	title: "Organism/NavApp",
	decorators: [
		() => ({
			// @ts-expect-error FIXME: Need to fix addon
			Component: Container,
		}),
	],
	parameters: {
		layout: "centered",
		sveltekit_experimental: {
			hrefs: {
				"/*": {
					callback: (to: string) => {
						current.pathname = to;
						action("onNavigate")(to);
					},
					asRegex: true,
				},
			},
		},
	},
});
</script>

<Story
	name="Preview"
	args={{
		current,
		links: [
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
		],
	}}
	parameters={PARAMETERS.default}
	tags={["autodocs", "dev"]}
/>
