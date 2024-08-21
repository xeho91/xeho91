<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { expect, waitFor, within } from "@storybook/test";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";

import Content from "./Content.svelte";

const { Story } = defineMeta({
	...SHARED_META,
	component: Content,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
});
</script>

<Story name="Playground" parameters={PARAMETERS.playground} />

<Story
	name="Loading"
	args={{ loading: true }}
	parameters={PARAMETERS.sample}
	play={async (context) => {
		const { canvasElement } = context;
		const canvas = within(canvasElement);
		const skeleton = canvas.getByRole("progressbar");
		expect(skeleton).toBeVisible();
	}}
/>

<Story
	name="Loaded"
	args={{ loading: false }}
	parameters={PARAMETERS.sample}
	play={async (context) => {
		const { canvasElement } = context;
		const canvas = within(canvasElement);
		const skeleton = canvas.getByRole("progressbar");
		await waitFor(
			() => {
				expect(skeleton).not.toBeVisible();
			},
			{ timeout: 2000 },
		);
	}}
/>
