<script context="module" lang="ts">
import { type Args, defineMeta, setTemplate } from "@storybook/addon-svelte-csf";
import { merge_classes } from "@xeho91/lib-feature/css";
import {
	PARAMETERS,
	create_control_from_iterable,
	create_control_from_range,
	create_control_from_string,
} from "@xeho91/lib-storybook/arg-type";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";
import { Code } from "@xeho91/lib-ui/semantic/code";

import Avatar, { AVATAR_DEFAULT_ID } from "./Avatar.svelte";

import { SHARED_ARG_TYPES } from "#component/props";
import { BrandAssetTheme } from "#design";

const { Story } = defineMeta({
	component: Avatar,
	title: "Brand/Avatar",
	argTypes: {
		...SHARED_ARG_TYPES,
		id: create_control_from_string(AVATAR_DEFAULT_ID, {
			category: "meta",
		}),
		theme: create_control_from_iterable(BrandAssetTheme, {
			category: "design",
		}),
	},
	tags: ["!dev"],
	parameters: {
		controls: { expanded: true },
		layout: "centered",
	},
});

const classes = merge_classes(
	//
	"size-[100px]",
);
</script>

<script lang="ts">
	import { Square } from "@xeho91/lib-geometry/two-dimension/square";
	import { DownloadImage, DownloadImageManager } from "@xeho91/lib-storybook/download-image";
	import { Range } from "@xeho91/lib-struct/range";

	let svg = $state<SVGElement>();

	setTemplate(template);
</script>

{#snippet template(args: Args<typeof Story>)}
	<Avatar {...args} class={classes} />
{/snippet}

<Story name="Playground" parameters={PARAMETERS.playground} />

<Story name="Default" parameters={PARAMETERS.default} />

<Story name="Backgrounded" parameters={PARAMETERS.variants}>
	<VariantsGroup prop="backgrounded" values={[false, true]}>
		{#snippet children( { backgrounded })}
			<Avatar id={`backgrounded-${backgrounded}`} {backgrounded} class={classes} />
		{/snippet}
	</VariantsGroup>
</Story>

<Story name="Animated" parameters={PARAMETERS.variants}>
	<VariantsGroup prop="animated" values={[false, true]}>
		{#snippet children( { animated })}
			<Avatar id={`animated-${animated}`} {animated} class={classes} />
		{/snippet}
	</VariantsGroup>
</Story>

<Story name="Themes" parameters={PARAMETERS.variants}>
	<VariantsGroup prop="theme" values={BrandAssetTheme}>
		{#snippet header()}
			<Code>{`background="false"`}</Code>
		{/snippet}
		{#snippet children( { theme })}
			<Avatar id={`theme-${theme}`} {theme} class={classes} />
		{/snippet}
	</VariantsGroup>
	<VariantsGroup prop="theme" values={BrandAssetTheme}>
		{#snippet header()}
			<Code>{`background="true"`}</Code>
		{/snippet}
		{#snippet children( { theme })}
			<Avatar id={`theme-${theme}-backgrounded`} {theme} backgrounded class={classes} />
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Download"
	argTypes={{
		format: create_control_from_iterable(DownloadImageManager, {
			default: "svg",
			summary: "ImageFormat",
			category: "download",
		}),
		size: create_control_from_range(new Range(32, 1024, 1), {
			category: "download",
		}),
	}}
>
	{#snippet children({ format, size, ...args })}
		{@const dimensions = new Square(size ?? 32)}
		<DownloadImage {svg} {dimensions} {format}>
			<Avatar {...args} bind:svg />
		</DownloadImage>
	{/snippet}
</Story>
