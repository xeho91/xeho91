<script lang="ts">
import "virtual:uno.css";
import "@xeho91/lib-asset/font/sans";
import "@xeho91/lib-asset/font/serif";
import "@xeho91/lib-asset/font/mono";

import { AtLayer } from "@xeho91/lib-css/at-rule/layer";
import { Reference } from "@xeho91/lib-css/reference";
import { Color } from "@xeho91/lib-design/color";
import { Font } from "@xeho91/lib-design/font";

import LayerStyles from "./LayerStyles.svelte";

import { state_css } from "./state.svelte";
import { classes } from "./util";

const radial_color = Color.get("secondary", "blend", 2);

$effect(() => {
	for (const scheme of Color.SCHEMES) {
		window.document.body.style.setProperty(
			new Reference(`--radial-gradient-color-${scheme}`).toString(),
			radial_color.light_dark[scheme].atomized_oklch.toString(),
		);
	}
});
</script>

<svelte:head>
	{#if state_css.at_properties.size > 0}
		<svelte:element this={"style"} id="custom-properties">
			{#each state_css.at_properties.values() as at_property}
				{at_property.toString()}
			{/each}
		</svelte:element>
	{/if}

	{#each AtLayer as name}
		<LayerStyles {name} />
	{/each}
</svelte:head>

<svelte:body
	use:classes={[
		"w[100lvw] min-h-[100lvh]",
		"grid",
		// Background
		Color.class("background"),
		Color.get("secondary", "solid", 1).class("background"),
		// Text
		Font.family.default().class(),
		Font.family.default().weight.default().class(),
		Font.size.default().class(),
		Color.class("text"),
		Color.get("secondary", "solid", 11).class("text"),
	]}
/>

<style>
	@import "@unocss/reset/tailwind-compat.css" layer(reset);

	@layer base.default {
		:root:where(:global(html[data-color-scheme="light"])) {
			color-scheme: light;
		}
		:root:where(:global(html[data-color-scheme="system"])) {
			color-scheme: light dark;
		}
		:root:where(:global(html[data-color-scheme="dark"])) {
			color-scheme: dark;
		}
	}

	@layer override {
		:global(*) {
			--box-shadow-color-light-lightness: 21%;
			--box-shadow-color-dark-lightness: 15%;
			--text-shadow-color-light-lightness: 21%;
			--text-shadow-color-dark-lightness: 15%;
		}
	}

	@layer base.preflight {
		/* TODO: Tokenize it */
		:root {
			--transition-fn: ease-in-out;
			--transition-dur: 250ms;

			/* prettier-ignore */
			--transition-props-box-shadow-color:
				--box-shadow-color-1,
				--box-shadow-color-2,
				--box-shadow-color-3;

			/* prettier-ignore */
			--transition-props-text-shadow-color:
				--text-shadow-color-1,
				--text-shadow-color-2,
				--text-shadow-color-3;

			/* prettier-ignore */
			--transition-props-color:
				background-color,
				border-color,
				--box-shadow-color,
				color,
				--text-shadow-color;

			/* prettier-ignore */
			--transition-props-box-shadow-x:
				--box-shadow-x-1,
				--box-shadow-x-2,
				--box-shadow-x-3;

			/* prettier-ignore */
			--transition-props-box-shadow-y:
				--box-shadow-y-1,
				--box-shadow-y-2,
				--box-shadow-y-3;

			/* prettier-ignore */
			--transition-props-box-shadow-spread:
				--box-shadow-spread-1,
				--box-shadow-spread-2,
				--box-shadow-spread-3;

			/* prettier-ignore */
			--transition-props-box-shadow-blur:
				--box-shadow-blur-1,
				--box-shadow-blur-2,
				--box-shadow-blur-3;

			/* prettier-ignore */
			--transition-props-text-shadow-x:
				--text-shadow-x-1,
				--text-shadow-x-2,
				--text-shadow-x-3;

			/* prettier-ignore */
			--transition-props-text-shadow-y:
				--text-shadow-y-1,
				--text-shadow-y-2,
				--text-shadow-y-3;

			/* prettier-ignore */
			--transition-props-text-shadow-blur:
				--text-shadow-blur-1,
				--text-shadow-blur-2,
				--text-shadow-blur-3;

			/* prettier-ignore */
			--transition-props-box-shadow:
				var(--transition-props-box-shadow-x),
				var(--transition-props-box-shadow-y),
				var(--transition-props-box-shadow-spread),
				var(--transition-props-box-shadow-blur);

			/* prettier-ignore */
			--transition-props-text-shadow:
				var(--transition-props-text-shadow-x),
				var(--transition-props-text-shadow-y),
				var(--transition-props-text-shadow-blur);
		}
	}

	@layer base.default {
		:global(html) {
			scroll-behavior: smooth;
			scroll-snap-type: y mandatory;
		}

		:global(body) {
			/* prettier-ignore */
			--radial-gradient-color-1: light-dark(var(--radial-gradient-color-light), var(--radial-gradient-color-dark));
			/* prettier-ignore */
			background-image:
				radial-gradient(at 25% 25%, var(--radial-gradient-color-1) 0px, transparent 50%),
				radial-gradient(at 25% 75%, transparent 0px, transparent 50%),
				radial-gradient(at 50% 50%, var(--radial-gradient-color-1) 0px, transparent 50%),
				radial-gradient(at 75% 25%, transparent 0px, transparent 50%),
				radial-gradient(at 75% 75%, var(--radial-gradient-color-1) 0px, transparent 50%);

			transition-duration: var(--transition-dur);
			transition-property: var(--transition-props-color);
			transition-timing-function: var(--transition-fn);
		}
	}
</style>
