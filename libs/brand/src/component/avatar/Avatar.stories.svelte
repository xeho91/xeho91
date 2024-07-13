<script context="module" lang="ts">
import { defineMeta, setTemplate, type Args } from "@storybook/addon-svelte-csf";
import {
	create_control_from_iterable,
	create_control_from_range,
	create_control_from_string,
} from "@xeho91/lib-storybook/arg-type";

import Avatar, { AVATAR_DEFAULT_ID } from "./Avatar.svelte";

import { SHARED_ARG_TYPES } from "#component/props";

const { Story } = defineMeta({
	component: Avatar,
	title: "Brand/Avatar",
	argTypes: {
		...SHARED_ARG_TYPES,
		id: create_control_from_string(AVATAR_DEFAULT_ID, {
			category: "meta",
		}),
	},
	tags: ["!dev"],
	parameters: {
		controls: { expanded: true },
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

{#snippet template(args: Args<typeof Story>)}
	<div style:min-width="100px" style:min-height="100px">
		<Avatar {...args} />
	</div>
{/snippet}

<Story name="Default" parameters={{ controls: { disable: true } }} />

<Story name="Backgrounded" parameters={{ controls: { disable: true } }}>
	<div style:min-width="200px" style:min-height="100px" style:display="flex">
		<Avatar id="background-transparent" />
		<Avatar id="background-color" backgrounded />
	</div>
</Story>

<Story name="Animated" parameters={{ controls: { disable: true } }}>
	<div style:min-width="200px" style:min-height="100px" style:display="flex">
		<Avatar id="not-animated" />
		<Avatar id="animated" animated />
	</div>
</Story>

<Story name="Themes" parameters={{ controls: { disable: true } }}>
	<div style:min-width="300px" style:min-height="100px" style:display="flex">
		<Avatar id="theme-color" theme="color" />
		<Avatar id="theme-black" theme="black" />
		<Avatar id="theme-white" theme="white" />
	</div>
	<div style:min-width="200px" style:min-height="100px" style:display="flex">
		<Avatar id="background-transparent-color" theme="color" backgrounded />
		<Avatar id="background-transparent-black" theme="black" backgrounded />
		<Avatar id="background-color-color-white" theme="white" backgrounded />
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
			<Avatar {...args} bind:svg />
		</DownloadImage>
	{/snippet}
</Story>
