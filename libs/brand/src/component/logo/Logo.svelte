<script context="module" lang="ts">
import { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";

export const LOGO_DEFAULT_ID = "xeho91-logo";
export const LOGO_DIMENSIONS = new Rectangle(300, 100);
export const LOGO_DEFAULT_ANIMATED = false;
export const LOGO_DEFAULT_BACKGROUNDED = false;
</script>

<script lang="ts">
	import SVG from "../_sub/SVG.svelte";
	import BackgroundSymbol from "../_sub/symbol/Background.svelte";
	import LinearGradient from "../_sub/LinearGradient.svelte";
	import LogotypeSymbol, {
		LOGOTYPE_DIMENSIONS,
	} from "../_sub/symbol/Logotype.svelte";
	import FeDropShadow from "../_sub/FeDropShadow.svelte";

	import type { SharedProps } from "#component/props";
	import { BrandAssetTheme } from "#design";
	import { set_id } from "#meta";

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

	const theme = $derived(new BrandAssetTheme(_theme));
	const fill = $derived(theme.get_fill_foreground(id));
	const dimensions = $derived(
		new Rectangle(background_width, background_height),
	);
	const translate_x = $derived(
		dimensions.half("width") - LOGOTYPE_DIMENSIONS.half("width"),
	);
	const translate_y = $derived(
		(dimensions.half("height") - LOGOTYPE_DIMENSIONS.half("height")) / 4,
	);

	const filter = `url(#${set_id(id, "shadow")})`;
</script>

<SVG
	bind:svg
	{id}
	title="TODO: ADD TITLE"
	description="TODO: ADD DESC"
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
		transform={`translate(${translate_x}, ${translate_y})`}
	/>
</SVG>
