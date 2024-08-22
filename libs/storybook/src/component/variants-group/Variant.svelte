<script lang="ts" generics="TComponent extends Component<any>, TPropName extends keyof ComponentProps<TComponent>, TValue extends ComponentProps<TComponent>[TPropName]">
import { Font } from "@xeho91/lib-design/font";
import { Space } from "@xeho91/lib-design/space";
import type { WithChildren } from "@xeho91/lib-feature/component";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import type { Component, ComponentProps } from "svelte";

interface Props extends WithChildren, WithClass {
	prop: TPropName;
	value: TValue;
}

const {
	//
	children,
	class: class_,
	prop,
	value,
}: Props = $props();

const font_family = Font.family.get("mono");
</script>

<div
	class={merge_classes(
		"variant",
		"flex flex-row items-center",
		Space.get("s").class("gap"),
		class_,
	)}
>
	{@render children()}
	<code
		class={merge_classes(
			font_family.class(),
			font_family.weight.default(),
			Font.size.default().class(),
			"whitespace-nowrap",
		)}
	>
		{prop}{"="}{typeof value === "string" ? `${`"${value}"`}` : `{${value}}`}
	</code>
</div>
