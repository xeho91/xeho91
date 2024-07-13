<script context="module">
import { defineMeta, setTemplate } from "@storybook/addon-svelte-csf";
import {
	create_control_from_iterable,
	create_control_from_range,
	create_control_from_string,
} from "@xeho91/lib-storybook/arg-type";

import Logo, { LOGO_DEFAULT_ID } from "./Logo.svelte";

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
	import { Square } from "@xeho91/lib-geometry/two-dimension/square";
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
		size: create_control_from_range(new Range(32, 1024, 1), {
			category: "download",
		}),
	}}
>
	{#snippet children({ format, size, ...args })}
		<DownloadImage {svg} dimensions={new Square(size ?? 32)} {format}>
			<Logo {...args} bind:svg />
		</DownloadImage>
	{/snippet}
</Story>
