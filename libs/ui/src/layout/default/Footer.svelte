<script lang="ts">
import { Logo } from "@xeho91/lib-brand/logo";
import { Color } from "@xeho91/lib-design/color";
import { Radius } from "@xeho91/lib-design/radius";
import { Space } from "@xeho91/lib-design/space";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { fade } from "svelte/transition";

import { LAYOUT_DEFAULT_FADE, LAYOUT_DEFAULT_SPACE_INLINE } from "./util";

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

<footer
	class={merge_classes(
		//
		"footer-main",
		// Layout
		"relative",
		"snap-start",
		"w-fit",
		Space.get("xs").class("margin-inline"),
		LAYOUT_DEFAULT_SPACE_INLINE.class("padding-inline"),
		Space.get("3xs").class("padding-block"),
		// Flex
		"flex place-content-center justify-self-center",
		// Background
		Color.class("background"),
		Color.get("secondary", "blend", 3).class("background"),
		// Border
		Color.class("border-top"),
		Color.class("border-inline"),
		Color.get("secondary", "blend", 6).class("border-top"),
		Color.get("secondary", "blend", 6).class("border-inline"),
		"border-solid",
		Stroke.get("s").class("top"),
		Stroke.get("s").class("inline"),
		Radius.get("m").class("start-start"),
		Radius.get("m").class("start-end"),
		// Other
		class_,
	)}
	transition:fade={{ ...LAYOUT_DEFAULT_FADE, delay: 250 }}
>
	<Container>
		<Paragraph
			size="s"
			class={merge_classes("flex-wrap place-content-center")}
		>
			<Text nowrap>
				<Icon name="legal" />
				{"CC BY-NC-SA 4.0 | 2016—present"}
			</Text>
			<Text nowrap>
				{"© Mateusz '"}
				<Logo animated class="h[1em]" />
				{"' Kadlubowski"}
			</Text>
		</Paragraph>
	</Container>
</footer>
