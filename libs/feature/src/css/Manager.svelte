<script lang="ts">
import { AtLayer } from "@xeho91/lib-css/at-rule/layer";
import { Color } from "@xeho91/lib-design/color";
import { Font } from "@xeho91/lib-design/font";

import LayerStyles from "./LayerStyles.svelte";

import { state_css } from "./state.svelte";
import { classes } from "./util";

import "virtual:uno.css";

const font_family = Font.family.default();
</script>

<svelte:head>
	{#if state_css.at_properties.size > 0}
		<svelte:element this={"style"} id="custom-properties">
			{#each state_css.at_properties.values() as at_property}
				{at_property.toString()}
			{/each}
		</svelte:element>
	{/if}

	<!-- FIXME: This doesn't work, because `uno.css` gets injected firstly. -->
	<svelte:element this={"style"} id="layers-order">
		{AtLayer.ORDER}
	</svelte:element>

	{#each AtLayer as name}
		<LayerStyles {name} />
	{/each}
</svelte:head>

<svelte:body
	use:classes={[
		Color.class("background"),
		Color.get("secondary", "solid", 1).class("background"),
		Color.class("text"),
		Color.get("secondary", "solid", 11).class("text"),
		font_family.class(),
		font_family.weight.default().class(),
		Font.size.default().class(),
	]}
/>

<style global>
	/* TODO: Move it to unocss config, and see if we can put into layer reset */
	@import "@unocss/reset/tailwind-compat.css" layer(reset);

	@layer base {
		:global(html[data-color-scheme="light"]) {
			color-scheme: light;
		}
		:global(html[data-color-scheme="dark"]) {
			color-scheme: dark;
		}
	}

	/* TODO: automate it */
	@layer base {
		:root {
			--transition-fn: ease-in-out;
			--transition-dur: 250ms;
			/* prettier-ignore */
			--transition-props-background-color:
				--background-color-lightness,
				--background-color-chroma,
				--background-color-hue,
				--background-color-alpha,
				--border-color-lightness
			;
			/* prettier-ignore */
			--transition-props-border-color:
				--border-color-lightness,
				--border-color-chroma,
				--border-color-hue,
				--border-color-alpha
			;
			/* prettier-ignore */
			--transition-props-box-shadow-color:
				--box-shadow-color-1,
				--box-shadow-color-2,
				--box-shadow-color-3
			;
			/* prettier-ignore */
			--transition-props-text-color:
				--text-color-lightness,
				--text-color-chroma,
				--text-color-hue,
				--text-color-alpha
			;
			/* prettier-ignore */
			--transition-props-text-shadow-color:
				--text-shadow-color-1,
				--text-shadow-color-2,
				--text-shadow-color-3
			;
			/* prettier-ignore */
			--transition-props-color:
				var(--transition-props-background-color),
				var(--transition-props-border-color),
				var(--transition-props-box-shadow-color),
				var(--transition-props-text-color),
				var(--transition-props-text-shadow-color)
			;
			/* prettier-ignore */
			--transition-props-box-shadow-x:
				--box-shadow-x-1,
				--box-shadow-x-2,
				--box-shadow-x-3
			;
			/* prettier-ignore */
			--transition-props-box-shadow-y:
				--box-shadow-y-1,
				--box-shadow-y-2,
				--box-shadow-y-3
			;
			/* prettier-ignore */
			--transition-props-box-shadow-spread:
				--box-shadow-spread-1,
				--box-shadow-spread-2,
				--box-shadow-spread-3
			;
			/* prettier-ignore */
			--transition-props-box-shadow-blur:
				--box-shadow-blur-1,
				--box-shadow-blur-2,
				--box-shadow-blur-3
			;
			/* prettier-ignore */
			--transition-props-text-shadow-x:
				--text-shadow-x-1,
				--text-shadow-x-2,
				--text-shadow-x-3
			;
			/* prettier-ignore */
			--transition-props-text-shadow-y:
				--text-shadow-y-1,
				--text-shadow-y-2,
				--text-shadow-y-3
			;
			/* prettier-ignore */
			--transition-props-text-shadow-blur:
				--text-shadow-blur-1,
				--text-shadow-blur-2,
				--text-shadow-blur-3
			;
			/* prettier-ignore */
			--transition-props-box-shadow:
				var(--transition-props-box-shadow-x),
				var(--transition-props-box-shadow-y),
				var(--transition-props-box-shadow-spread),
				var(--transition-props-box-shadow-blur)
			;
			/* prettier-ignore */
			--transition-props-text-shadow:
				var(--transition-props-text-shadow-x),
				var(--transition-props-text-shadow-y),
				var(--transition-props-text-shadow-blur)
			;
		}
	}

	@layer base {
		body {
			transition-duration: var(--transition-dur);
			transition-timing-function: var(--transition-fn);
			transition-property: var(--transition-props-color);
		}
	}
</style>
