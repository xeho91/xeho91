<script context="module" lang="ts">
import { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";

export const LOGO_DEFAULT_ID = "xeho91-logo";
export const LOGO_TITLE = "xeho91's logo";
export const LOGO_DESCRIPTION = `xeho91's logotype painted in the style of quickly using a paintbrush on the wall. It\'s written "xeho91" in capital letters.'`;
export const LOGO_DIMENSIONS = new Rectangle(300, 100);
export const LOGO_DEFAULT_ANIMATED = false;
export const LOGO_DEFAULT_BACKGROUNDED = false;
</script>

<script lang="ts">
	import { Percentage } from "@xeho91/lib-struct/percentage";

	import SVG from "../_sub/SVG.svelte";
	import BackgroundSymbol from "../_sub/symbol/Background.svelte";
	import LinearGradient from "../_sub/LinearGradient.svelte";
	import LogotypeSymbol, { LOGOTYPE_DIMENSIONS } from "../_sub/symbol/Logotype.svelte";
	import FeDropShadow, { SHADOW_OFFSET_X } from "../_sub/FeDropShadow.svelte";

	import type { SharedProps } from "#component/props";
	import { BrandAssetTheme } from "#design";
	import { set_id } from "#id";

	interface Props extends SharedProps {
		/**
		 * Override the unique ID of xeho91's logo.
		 * @default {@link LOGO_DEFAULT_ID}
		 */
		id?: string;
		/**
		 * Width of the background - has to be higher than logotype's width _(**including the safe space** for the shadow
		 * and the frame)_.
		 * @default {@link LOGO_MIN_WIDTH}
		 */
		background_width?: number;
		/**
		 * Height of the background - has to be higher than logotype's height _(**including the safe space** for the shadow
		 * and the frame)_.
		 * @default {@link LOGO_MIN_HEIGHT}
		 */
		background_height?: number;
	}

	let {
		id = LOGO_DEFAULT_ID,
		theme: _theme = BrandAssetTheme.DEFAULT,
		background_width = LOGO_DIMENSIONS.width,
		background_height = LOGO_DIMENSIONS.height,
		animated = LOGO_DEFAULT_ANIMATED,
		backgrounded = LOGO_DEFAULT_BACKGROUNDED,
		svg = $bindable(),
	}: Props = $props();

	let theme = $derived(new BrandAssetTheme(_theme));
	let fill = $derived(theme.get_fill_foreground(id));
	let dimensions = $derived(new Rectangle(background_width, background_height));
	let shadow_safe_area_x = $derived(new Percentage(SHADOW_OFFSET_X * 4, background_height));
	let scale = $derived(1 - shadow_safe_area_x.decimal * 2);
	let translate_x = $derived((-LOGOTYPE_DIMENSIONS.width / 2) * scale);
	let translate_y = $derived((-LOGOTYPE_DIMENSIONS.height / 2) * scale);

	const filter = `url(#${set_id(id, "shadow")})`;
</script>

<SVG
	bind:svg
	{id}
	title={LOGO_TITLE}
	description={LOGO_DESCRIPTION}
	{dimensions}
	{theme}
>
	<defs>
		{#if _theme === "color"}
			<LinearGradient {id} {animated} />
		{/if}
		<FeDropShadow {id} />
		{#if backgrounded}
			<BackgroundSymbol {id} {theme} {dimensions} shape="rectangle" />
		{/if}
		<LogotypeSymbol {id} />
	</defs>

	{#if backgrounded}
		<use href={`#${set_id(id, "background")}`} />
	{/if}
	<use
		href={`#${set_id(id, "logotype")}`}
		{fill}
		{filter}
		x="50%"
		y="50%"
		transform={`scale(${scale}) translate(${translate_x} ${translate_y})`}
	/>
</SVG>
