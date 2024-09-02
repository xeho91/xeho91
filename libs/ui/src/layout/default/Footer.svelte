<script lang="ts">
import { Logo } from "@xeho91/lib-brand/logo";
import { Color } from "@xeho91/lib-design/color";
import { Radius } from "@xeho91/lib-design/radius";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { fade } from "svelte/transition";

import { LAYOUT_DEFAULT_FADE, LAYOUT_DEFAULT_GRID_GUTTER } from "./util";

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
	class={merge_classes(
		//
		"footer-main",
		"relative inset-x-1/2",
		"w-[100dvw] mx-[-50dvw] h-fit",
		"snap-end",
		LAYOUT_DEFAULT_GRID_GUTTER.class("padding-block"),
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
	<Paragraph align="center" size="l">
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
