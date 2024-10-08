<script context="module" lang="ts">
import { type Args, defineMeta, setTemplate } from "@storybook/addon-svelte-csf";
import { merge_classes } from "@xeho91/lib-feature/css";
import {
	create_control_from_iterable,
	create_control_from_range,
	create_control_from_string,
} from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Avatar, { AVATAR_DEFAULT_ID } from "./Avatar.svelte";

import { SHARED_ARG_TYPES } from "#component/props";
import { BrandAssetTheme } from "#design";

const { Story } = defineMeta({
	...SHARED_META,
	component: Avatar,
	title: "brand/Avatar",
	argTypes: {
		...SHARED_ARG_TYPES,
		id: create_control_from_string(AVATAR_DEFAULT_ID, {
			category: "meta",
		}),
		theme: create_control_from_iterable(BrandAssetTheme, {
			category: "design",
		}),
	},
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

<Story
	name="Playground"
	parameters={PARAMETERS.playground}
	tags={["!autodocs", "!dev"]}
/>

<Story
	name="Default"
	parameters={PARAMETERS.default}
	tags={["!dev"]}
/>

<Story
	name="Backgrounded"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="backgrounded" values={[false, true]}>
		{#snippet children( { backgrounded })}
			<Avatar id={`backgrounded-${backgrounded}`} {backgrounded} class={classes} />
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Animated"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="animated" values={[false, true]}>
		{#snippet children( { animated })}
			<Avatar id={`animated-${animated}`} {animated} class={classes} />
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Themes"
	parameters={PARAMETERS.variants}
	tags={["!dev"]}
>
	<VariantsGroup prop="theme" values={BrandAssetTheme}>
		{#snippet header()}
			<code>{`background="false"`}</code>
		{/snippet}
		{#snippet children( { theme })}
			<Avatar id={`theme-${theme}`} {theme} class={classes} />
		{/snippet}
	</VariantsGroup>
	<VariantsGroup prop="theme" values={BrandAssetTheme}>
		{#snippet header()}
			<code>{`background="true"`}</code>
		{/snippet}
		{#snippet children( { theme })}
			<Avatar id={`theme-${theme}-backgrounded`} {theme} backgrounded class={classes} />
		{/snippet}
	</VariantsGroup>
</Story>

<Story
	name="Download"
	tags={["!autodocs"]}
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
