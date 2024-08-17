<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import { Space } from "@xeho91/lib-design/space";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { fade } from "svelte/transition";

import { LAYOUT_DEFAULT_FADE, LAYOUT_DEFAULT_SPACE_INLINE } from "./util";

import { Container } from "#primitive/container/mod";
import { Icon } from "#primitive/icon/mod";
import { Skeleton } from "#primitive/skeleton/mod";
import { Text } from "#primitive/text/mod";
import { Paragraph } from "#semantic/paragraph/mod";

interface Props extends WithClass {
	loading?: boolean;
}

let {
	//
	class: class_,
	loading = false,
}: Props = $props();

let rendered = $state(false);

$effect(() => {
	rendered = true;
});
</script>

<footer
	class={merge_classes(
		//
		"footer-main",
		// Layout
		"relative",
		LAYOUT_DEFAULT_SPACE_INLINE.class("padding-inline"),
		Space.get("3xs").class("padding-block"),
		// Flex
		"flex place-content-center",
		// Background
		Color.class("background"),
		Color.get("secondary", "blend", 3).class("background"),
		// Border
		Color.class("border-top"),
		Color.get("secondary", "blend", 6).class("border-top"),
		"border-solid",
		Stroke.get("s").class("top"),
		class_,
	)}
	transition:fade={LAYOUT_DEFAULT_FADE}
>
	<Skeleton
		color="secondary"
		background_color="secondary"
		hidden={rendered && !loading}
		variant="rect"
		class={merge_classes(
			//
			"absolute inset-0 z-10",
			"h-full",
		)}
	/>
	<Container>
		<Paragraph
			size="s"
			class={merge_classes("flex-wrap place-content-center")}
		>
			<Text nowrap>
				<Icon name="legal" />
				{"CC BY-NC-SA 4.0 2016—present"}
			</Text>
			<Text nowrap>
				{"© Mateusz "}
				<em>'xeho91'</em>{" Kadlubowski"}
			</Text>
		</Paragraph>
	</Container>
</footer>
