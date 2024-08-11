<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import type { ElevationLevel } from "@xeho91/lib-design/elevation";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Radius } from "@xeho91/lib-design/radius";
import { Space } from "@xeho91/lib-design/space";
import type { WithClass } from "@xeho91/lib-feature/css/mod";
import { merge_classes } from "@xeho91/lib-feature/css/util";

interface Props extends WithClass {
	level: ElevationLevel;
}

const {
	//
	class: class_,
	level = Elevation.DEFAULT,
}: Props = $props();
</script>

<div
	class={merge_classes(
		"elevation",
		Space.default().class("height"),
		Space.default().class("width"),
		Color.get("secondary", "solid", 3).class("background"),
		Color.class("background"),
		Elevation.class("box-shadow"),
		Elevation.get(level).class("box-shadow"),
		Color.get("primary", "blend").class("box-shadow"),
		Radius.get("circle").class(),
		class_,
	)}
></div>

<style>
	.elevation {
		animation: rainbow 5s infinite ease-in-out;
	}

	@keyframes rainbow {
		0% {
			--background-color-light-hue: 0turn;
			--background-color-dark-hue: 0turn;
			--box-shadow-color-light-hue: 0turn;
			--box-shadow-color-dark-hue: 0turn;
		}

		100% {
			--background-color-light-hue: 1turn;
			--background-color-dark-hue: 1turn;
			--box-shadow-color-light-hue: 1turn;
			--box-shadow-color-dark-hue: 1turn;
		}
	}
</style>
