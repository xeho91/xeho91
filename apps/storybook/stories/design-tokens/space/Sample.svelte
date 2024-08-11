<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import { Space, type SpaceSize } from "@xeho91/lib-design/space";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";

interface Props extends WithClass {
	size?: SpaceSize;
}

const {
	//
	class: class_,
	size = Space.DEFAULT,
}: Props = $props();
</script>

<div
	class={merge_classes(
		"space",
		Space.get(size).class("height"),
		Space.get(size).class("width"),
		Color.class("background"),
		Color.get("primary").class("background"),
		class_,
	)}
></div>

<style>
	.space {
		transition-property: width, height;
		transition-duration: 0.2s;
		transition-timing-function: ease-in-out;
	}
</style>
