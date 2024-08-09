<script lang="ts" generics="TComponent extends Component<any>, TPropName extends keyof ComponentProps<TComponent>, TValue extends ComponentProps<TComponent>[TPropName]">
import { Space } from "@xeho91/lib-design/space";
import { classes, type WithClass } from "@xeho91/lib-feature/css";
import { Code } from "@xeho91/lib-ui/semantic/code";
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
	use:classes={[
		"variant",
		"flex flex-row items-center",
		Space.get("s").class("gap"),
		class_,
	]}
>
	{@render children()}
	<Code>
		{prop}{"="}{typeof value === "string" ? `${`"${value}"`}` : `{${value}}`}
	</Code>
</div>
