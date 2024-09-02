<script context="module" lang="ts">
import { Square } from "@xeho91/lib-geometry/two-dimension/square";

export const AVATAR_DEFAULT_ID = "xeho91-avatar";
export const AVATAR_TITLE = "xeho91's avatar";
export const AVATAR_DESCRIPTION = `In the style of quickly using a paintbrush on the wall. It\'s written "x" in uppercase.'`;
export const AVATAR_DIMENSIONS = new Square(100);
export const AVATAR_DEFAULT_ANIMATED = false;
export const AVATAR_DEFAULT_BACKGROUNDED = false;
</script>

<script lang="ts">
	import SVG from "../_sub/SVG.svelte";
	import BackgroundSymbol from "../_sub/symbol/Background.svelte";
	import FrameSymbol from "../_sub/symbol/Frame.svelte";
	import LinearGradient from "../_sub/LinearGradient.svelte";
	import LogomarkSymbol, {
		DIMENSIONS_LOGOMARK,
	} from "../_sub/symbol/Logomark.svelte";
	import FeDropShadow from "../_sub/FeDropShadow.svelte";

	import type { SharedProps } from "#component/props";
	import { BrandAssetTheme } from "#design";
	import { set_id } from "#id";

	interface Props extends SharedProps {
		/**
		 * Override the unique ID of xeho91's avatar.
		 * @default {@link AVATAR_DEFAULT_ID}
		 */
		id?: string;
	}

	let {
		class: class_,
		id = AVATAR_DEFAULT_ID,
		theme: _theme = BrandAssetTheme.DEFAULT,
		animated = AVATAR_DEFAULT_ANIMATED,
		backgrounded = AVATAR_DEFAULT_BACKGROUNDED,
		svg = $bindable(),
		...rest_props
	}: Props = $props();

	let theme = $derived(new BrandAssetTheme(_theme));
	let fill = $derived(theme.fill_foreground(id).toString());

	const dimensions_rectangle = AVATAR_DIMENSIONS.to_rectangle();
	const translate_x =
		AVATAR_DIMENSIONS.half() - DIMENSIONS_LOGOMARK.half("width");
	const translate_y =
		(AVATAR_DIMENSIONS.half() - DIMENSIONS_LOGOMARK.half("height")) / 4;

	const filter = `url(#${set_id(id, "shadow")})`;
</script>

<SVG
	{...rest_props}
	bind:svg
	{id}
	title={AVATAR_TITLE}
	description={AVATAR_DESCRIPTION}
	dimensions={AVATAR_DIMENSIONS.to_rectangle()}
	{theme}
	style={"aspect-ratio:1;width:fit-content"}
	class={class_}
>
	<defs>
		{#if _theme === "color"}
			<LinearGradient {id} {animated} />
		{/if}
		<FeDropShadow {id} />
		{#if backgrounded}
			<BackgroundSymbol
				{id}
				{theme}
				dimensions={dimensions_rectangle}
				shape="circle"
			/>
		{/if}
		<FrameSymbol {id} dimensions={AVATAR_DIMENSIONS} shape="circle" />
		<LogomarkSymbol {id} />
	</defs>

	{#if backgrounded}
		<use href={`#${set_id(id, "background")}`} />
	{/if}
	<use href={`#${set_id(id, "frame")}`} {fill} fill-rule="evenodd" {filter} />
	<use
		href={`#${set_id(id, "logomark")}`}
		{fill}
		{filter}
		transform={`translate(${translate_x}, ${translate_y})`}
	/>
</SVG>
