<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import { Space } from "@xeho91/lib-design/space";
import { Stroke, type StrokeSize } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";

interface Props extends WithClass {
	size?: StrokeSize;
}

const {
	//
	class: class_,
	size = Stroke.DEFAULT,
}: Props = $props();
</script>

<div
	class={merge_classes(
		"stroke",
		Space.default().class("height"),
		Space.default().class("width"),
		Color.class("background"),
		Color.get("primary", "blend", 3).class("background"),
		"border-solid",
		Color.class("border"),
		Color.get("secondary", "blend", 7).class("border"),
		Stroke.get(size).class(),
		class_,
	)}
></div>

<style>
	/* TODO: Create motion design tokens */
	.stroke {
		transition-property: border-width;
		transition-duration: 0.2s;
		transition-timing-function: ease-in-out;
	}
</style>
