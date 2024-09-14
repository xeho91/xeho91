<script lang="ts">
import { Logo } from "@xeho91/lib-brand/logo";
import { Color } from "@xeho91/lib-design/color";
import { Grid } from "@xeho91/lib-design/grid";
import { Radius } from "@xeho91/lib-design/radius";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes, merge_styles } from "@xeho91/lib-feature/css";
import { fade } from "svelte/transition";

import { LAYOUT_DEFAULT_FADE } from "./util";

import { Container } from "#primitive/container/mod";
import { Icon } from "#primitive/icon/mod";
import { Text } from "#primitive/text/mod";
import { Paragraph } from "#semantic/paragraph/mod";

interface Props extends WithClass {}

let {
	//
	class: class_,
}: Props = $props();
</script>

<Container
	tag="footer"
	name="footer-main"
	grid
	style={merge_styles([
		"margin-inline",
		`calc(-50lvw - (${Grid.max.get("default").var} / 2))`,
	])}
	class={merge_classes(
		//
		"footer-main",
		"grid-cols-subgrid",
		// "relative inset-x-1/2",
		// "w-[100dvw] mx-[-50dvw] h-fit",
		"snap-end",
		Grid.gutter.get("default").class("padding-block"),
		"self-end col-span-full",
		// Background
		Color.class("background"),
		Color.get("secondary", "blend", 3).class("background"),
		// Border
		Color.class("border-top"),
		Color.get("secondary", "blend", 6).class("border-top"),
		"border-solid",
		Stroke.get("s").class("top"),
		Radius.get("xl").class("start-start"),
		Radius.get("xl").class("start-end"),
		// Other
		class_,
	)}
	in={(node) => fade(node, { ...LAYOUT_DEFAULT_FADE, delay: 250 })}
>
	<Paragraph
		align="center"
		size="l"
		class={merge_classes("col-start-2 col-end-12")}
	>
		<Text nowrap>
			<Icon name="legal" />
			{"CC BY-NC-SA 4.0 | 2016—present"}
		</Text>
		<br />
		<Text nowrap>
			{"© Mateusz '"}
			<Logo animated class="inline h[1em]" />
			{"' Kadlubowski"}
		</Text>
	</Paragraph>
</Container>
