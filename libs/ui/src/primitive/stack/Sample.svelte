<script>
import { Color } from "@xeho91/lib-design/color";
import { Radius } from "@xeho91/lib-design/radius";
import { merge_classes } from "@xeho91/lib-feature/css";
</script>

{#each Color.brand as color}
	<div
		class={merge_classes(
			"w-[50px] h-[50px]",
			Color.class("background"),
			Color.get(color, "opaque").class("background"),
			Radius.get("circle").class(),
		)}
	></div>
{/each}
