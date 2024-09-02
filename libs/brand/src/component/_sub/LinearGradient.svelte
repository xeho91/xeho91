<script context="module" lang="ts">
export const GRADIENT_COLORS = readonly_object({
	light: new ColorGradient(Color.get("primary", "opaque", 9).light, Color.get("accent", "opaque", 9).light),
	dark: new ColorGradient(Color.get("primary", "opaque", 9).dark, Color.get("accent", "opaque", 9).dark),
});
export const GRADIENT_ROTATE = 90;
export const GRADIENT_STOPS = new Range(1, 5, 1);
</script>

<script lang="ts">
	import { LightDark } from "@xeho91/lib-css/function/light-dark";
	import { Reference } from "@xeho91/lib-css/reference";
	import { Color } from "@xeho91/lib-design/color";
	import { ColorGradient } from "@xeho91/lib-design/color/gradient";
	import { merge_styles } from "@xeho91/lib-feature/css";
	import { Range } from "@xeho91/lib-struct/range";
	import { readonly_object } from "@xeho91/lib-snippet/object";
	import type { Display } from "@xeho91/lib-type/trait/display";

	import { set_id } from "#id";

	interface Props {
		id: string;
		rotate?: number;
		animated: boolean;
	}

	let { id, rotate = GRADIENT_ROTATE, animated }: Props = $props();

	let styles: Array<[Reference, Display]> = [];

	for (const stop of GRADIENT_STOPS) {
		let reference_light = new Reference(`light-${stop}`);
		let reference_dark = new Reference(`dark-${stop}`);
		styles.push(
			[reference_light, GRADIENT_COLORS.light.get_stop(stop)],
			[reference_dark, GRADIENT_COLORS.dark.get_stop(stop)],
			[
				new Reference(`gradient-stop-${stop}`),
				new LightDark(
					reference_light.to_var(),
					reference_dark.to_var(),
				),
			],
		);
	}
</script>

<linearGradient
	id={set_id(id, "gradient")}
	gradientTransform={`rotate(${rotate})`}
	gradientUnits="objectBoundingBox"
	spreadMethod="pad"
	style={merge_styles(...styles)}
>
	{#each ColorGradient.STOPS as stop_position}
		<stop
			offset={ColorGradient.get_offset(stop_position).toString()}
			stop-color={`var(--gradient-stop-${stop_position})`}
		/>
	{/each}
	{#if animated}
		<animateTransform
			attributeName="gradientTransform"
			type="rotate"
			from="0"
			to="360"
			dur="6s"
			repeatCount="indefinite"
		/>
	{/if}
</linearGradient>
