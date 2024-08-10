<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import { Radius, type RadiusSize } from "@xeho91/lib-design/radius";
import { Space } from "@xeho91/lib-design/space";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";

interface Props extends WithClass {
	size?: RadiusSize;
}

const {
	//
	class: class_,
	size = Radius.DEFAULT,
}: Props = $props();
</script>

<div
	class={merge_classes(
		"radius",
		"relative",
		Space.default().class("height"),
		Space.default().class("width"),
		Radius.get(size).class(),
		Color.class("background"),
		size !== "circle" &&
			Color.get("primary", "solid", 3).class("background"),
		size === "circle" && Color.get("secondary").class("background"),
		class_,
	)}
>
	{#if size !== "circle"}
		{#each { length: 4 } as _}
			<div
				style:--corner-size={Radius.get(size).value.toString()}
				class={merge_classes(
					"corner",
					"absolute",
					"size-[var(--corner-size)]",
					Radius.get("circle").class(),
					Color.class("background"),
					Color.get("secondary").class("background"),
				)}
			></div>
		{/each}
	{/if}
</div>

<style>
	/* TODO: Create motion design tokens */
	.radius,
	.corner {
		transition-property: width, height, border-radius;
		transition-duration: 0.2s;
		transition-timing-function: ease-in-out;
	}

	.corner:nth-child(1) {
		top: 0;
		left: 0;
	}
	.corner:nth-child(2) {
		top: 0;
		right: 0;
	}
	.corner:nth-child(3) {
		bottom: 0;
		left: 0;
	}
	.corner:nth-child(4) {
		bottom: 0;
		right: 0;
	}
</style>
