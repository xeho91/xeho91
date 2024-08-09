<script lang="ts" generics="TComponent extends Component<any>, TPropName extends keyof ComponentProps<TComponent>, TValue extends ComponentProps<TComponent>[TPropName]">
import { merge_classes, type WithClass } from "@xeho91/lib-feature/css";
import { Font } from "@xeho91/lib-design/font";
import { Space } from "@xeho91/lib-design/space";
import type { ComponentProps, Snippet, Component } from "svelte";

interface Props extends WithClass {
	children: Snippet;
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
			Font.family.get("mono").class(),
			Font.size.default().class(),
		)}
	>
		{prop}{"="}{typeof value === "string" ? `${`"${value}"`}` : `{${value}}`}
	</code>
</div>
