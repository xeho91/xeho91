<script context="module">
import { defineMeta, setTemplate } from "@storybook/addon-svelte-csf";
import { merge_classes } from "@xeho91/lib-feature/css";
import {
	create_control_from_iterable,
	create_control_from_range,
	create_control_from_string,
} from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import Logo, { LOGO_DEFAULT_ID, LOGO_DIMENSIONS } from "./Logo.svelte";

import { SHARED_ARG_TYPES } from "#component/props";
import { BrandAssetTheme } from "#design";

const { Story } = defineMeta({
	...SHARED_META,
	component: Logo,
	title: "Brand/Logo",
	argTypes: {
		...SHARED_ARG_TYPES,
		id: create_control_from_string(LOGO_DEFAULT_ID, {
			category: "meta",
		}),
		theme: create_control_from_iterable(BrandAssetTheme, {
			category: "design",
		}),
	},
	parameters: {
		layout: "centered",
	},
});

const classes = merge_classes(
	//
	"w-[300px]",
	"h-[100px]",
);
</script>

<script lang="ts">
	import { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";
	import { DownloadImage, DownloadImageManager } from "@xeho91/lib-storybook/download-image";
	import { Range } from "@xeho91/lib-struct/range";

	let svg = $state<SVGElement>();

	setTemplate(template);
</script>

{#snippet template(args)}
	<Logo {...args} class={classes} />
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
			<Logo id={`backgrounded-${backgrounded}`} {backgrounded} class={classes} />
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
			<Logo id={`animated-${animated}`} {animated} class={classes} />
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
			<Logo id={`theme-${theme}`} {theme} class={classes} />
		{/snippet}
	</VariantsGroup>
	<VariantsGroup prop="theme" values={BrandAssetTheme}>
		{#snippet header()}
			<code>{`background="true"`}</code>
		{/snippet}
		{#snippet children( { theme })}
			<Logo id={`theme-${theme}-backgrounded`} {theme} backgrounded class={classes} />
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
		background_width: create_control_from_range(new Range(LOGO_DIMENSIONS.width, 2160, 1), {
			category: "download",
		}),
		background_height: create_control_from_range(new Range(LOGO_DIMENSIONS.height, 2160, 1), {
			category: "download",
		}),
		scale: create_control_from_range(new Range(1, 10, 0.05), {
			category: "download",
		}),
	}}
>
	{#snippet children({ format, background_width, background_height, scale, ...args })}
		{@const dimensions = new Rectangle(background_width ?? LOGO_DIMENSIONS.width, background_height ?? LOGO_DIMENSIONS.height)}
		<DownloadImage
			{svg}
			{dimensions}
			{format}
			{scale}
		>
			<Logo {...args} {background_width} {background_height} bind:svg />
		</DownloadImage>
	{/snippet}
</Story>
