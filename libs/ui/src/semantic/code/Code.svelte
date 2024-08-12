<script lang="ts">
import { Color } from "@xeho91/lib-design/color";
import type { FontSizeKey } from "@xeho91/lib-design/font/size";
import type { FontWeightMonoKey } from "@xeho91/lib-design/font/weight";
import { Radius } from "@xeho91/lib-design/radius";
import { Space } from "@xeho91/lib-design/space";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { ComponentProps } from "svelte";

import type { CodeWeight } from "./util";

import { Text } from "#primitive/text/mod";

interface Props extends WithClass {
	/**
	 * Font's **size** from [design tokens](https://shan-shan.gitbook.io/handbook/design/brandbook/broom#typography)
	 */
	size?: FontSizeKey;
	/**
	 * Font's **weight** from [design tokens](https://shan-shan.gitbook.io/handbook/design/brandbook/broom#typography)
	 */
	weight?: CodeWeight;
}

type TextProps = Omit<ComponentProps<Text<"code", "mono", FontWeightMonoKey>>, "tag" | "class" | "family">;

const {
	//
	children,
	class: class_,
	color,
	size = "m",
	weight = "regular",
	...text_props
}: Props & TextProps = $props();
</script>

<Text
	{...text_props}
	tag="code"
	class={merge_classes(
		"code",
		"whitespace-nowrap",
		Space.get("3xs").class("padding-inline"),
		Radius.get("s").class(),
		Color.class("background"),
		Color.get(color ?? "primary", "blend", 3).class("background"),
		class_,
	)}
	family="mono"
	{weight}
	{size}
>
	{@render children()}
</Text>

<style>
@layer component {
	:global(.code) {
		transition-duration: var(--transition-dur);
		transition-timing-function: var(--transition-fn);
		transition-property: background-color, color;
	}
}
</style>
