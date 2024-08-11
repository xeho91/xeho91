<script lang="ts">
import { Color, type ColorName, type ColorStep, type ColorType } from "@xeho91/lib-design/color";
import { Radius } from "@xeho91/lib-design/radius";
import { Space } from "@xeho91/lib-design/space";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";

import { Text } from "@xeho91/lib-ui/primitive/text";

interface Props extends WithClass {
	name?: ColorName;
	type?: ColorType;
	step?: ColorStep;
}

const {
	//
	class: class_,
	name = "primary",
	step = 8,
	type = "solid",
}: Props = $props();
</script>

<div
	class={merge_classes(
		"color",
		"flex justify-center items-center",
		Space.default().class("width"),
		Space.default().class("height"),
		Color.get(name, type, step).class("background"),
		Color.class("background"),
		step <= 2 && Radius.get("s").class(),
		step > 2 && Radius.get("m").class(),
		step > 5 && Radius.get("l").class(),
		step > 8 && Radius.get("xl").class(),
		step > 10 && Radius.get("circle").class(),
		class_,
	)}
>
	<Text
		color={name === "white"
			? "black"
			: name === "black" && step < 7 && type === "blend"
				? "black"
				: name === "black"
					? "white"
					: step > 8
						? "white"
						: "black"}
		contrasted={step > 5}
		family="mono"
	>
		{step}
	</Text>
</div>

<style>
	.color {
		transition-property: background-color, border-radius;
		transition-duration: var(--transition-dur);
		transition-timing-function: var(--transition-fn);
	}
</style>
