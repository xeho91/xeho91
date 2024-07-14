<script context="module">
import { defineMeta, setTemplate } from "@storybook/addon-svelte-csf";
import {
	create_control_from_iterable,
	create_control_from_range,
	create_control_from_string,
} from "@xeho91/lib-storybook/arg-type";

import Logo, { LOGO_DEFAULT_ID, LOGO_DIMENSIONS } from "./Logo.svelte";

import { SHARED_ARG_TYPES } from "#component/props";

const { Story } = defineMeta({
	component: Logo,
	title: "Brand/Logo",
	argTypes: {
		...SHARED_ARG_TYPES,
		id: create_control_from_string(LOGO_DEFAULT_ID, {
			category: "meta",
		}),
	},
	tags: ["!dev"],
	parameters: {
		layout: "centered",
	},
});
</script>

<script lang="ts">
	import { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";
	import DownloadImage, { DownloadImageManager } from "@xeho91/lib-storybook/download-image";
	import { Range } from "@xeho91/lib-struct/range";

	let svg = $state<SVGElement>();

	setTemplate(template);
</script>

{#snippet template(args)}
	<div style:min-width="300px" style:min-height="100px">
		<Logo {...args} />
	</div>
{/snippet}

<Story name="Default" />

<Story name="Backgrounded">
	<div style:min-width="200px" style:min-height="100px" style:display="flex">
		<Logo id="background-transparent" />
		<Logo id="background-color" backgrounded />
	</div>
</Story>

<Story name="Animated">
	<div style:min-width="200px" style:min-height="100px" style:display="flex">
		<Logo id="not-animated" />
		<Logo id="animated" animated />
	</div>
</Story>

<Story name="Themes">
	<div style:min-width="300px" style:min-height="100px" style:display="flex">
		<Logo id="theme-color" theme="color" />
		<Logo id="theme-black" theme="black" />
		<Logo id="theme-white" theme="white" />
	</div>
	<div style:min-width="300px" style:min-height="100px" style:display="flex">
		<Logo id="background-transparent-color" theme="color" backgrounded />
		<Logo id="background-transparent-black" theme="black" backgrounded />
		<Logo id="background-color-color-white" theme="white" backgrounded />
	</div>
</Story>

<Story
	name="Download"
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
