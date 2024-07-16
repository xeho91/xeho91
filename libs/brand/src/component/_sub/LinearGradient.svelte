<script context="module" lang="ts">
export const GRADIENT_ROTATE = 90;
</script>

<script lang="ts">
	import { ColorGradient } from "@xeho91/lib-color/gradient";
	import { PALETTE_PRIMARY } from "@xeho91/lib-color/palette/brand/primary";
	import { PALETTE_ACCENT } from "@xeho91/lib-color/palette/brand/accent";

	import { set_id } from "#id";

	interface Props {
		id: string;
		rotate?: number;
		animated: boolean;
	}

	let { id, rotate = GRADIENT_ROTATE, animated }: Props = $props();

	const gradient_light = new ColorGradient(
		PALETTE_PRIMARY.solid("light", 9),
		PALETTE_ACCENT.solid("light", 9),
	);
	const gradient_dark = new ColorGradient(
		PALETTE_PRIMARY.solid("dark", 9),
		PALETTE_ACCENT.solid("dark", 9),
	);
</script>

<linearGradient
	id={set_id(id, "gradient")}
	gradientTransform={`rotate(${rotate})`}
	gradientUnits="objectBoundingBox"
	spreadMethod="pad"
	style:--light-1={gradient_light.get_stop(1).toString()}
	style:--light-2={gradient_light.get_stop(2).toString()}
	style:--light-3={gradient_light.get_stop(3).toString()}
	style:--light-4={gradient_light.get_stop(4).toString()}
	style:--light-5={gradient_light.get_stop(5).toString()}
	style:--dark-1={gradient_dark.get_stop(1).toString()}
	style:--dark-2={gradient_dark.get_stop(2).toString()}
	style:--dark-3={gradient_dark.get_stop(3).toString()}
	style:--dark-4={gradient_dark.get_stop(4).toString()}
	style:--dark-5={gradient_dark.get_stop(5).toString()}
	style:--gradient-stop-1="light-dark(var(--light-1), var(--dark-1))"
	style:--gradient-stop-2="light-dark(var(--light-2), var(--dark-2))"
	style:--gradient-stop-3="light-dark(var(--light-3), var(--dark-3))"
	style:--gradient-stop-4="light-dark(var(--light-4), var(--dark-4))"
	style:--gradient-stop-5="light-dark(var(--light-5), var(--dark-5))"
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
