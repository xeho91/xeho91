<script lang="ts">
import { merge_classes } from "@xeho91/lib-feature/css";
import { Text } from "@xeho91/lib-ui/primitive/text";
import { Heading } from "@xeho91/lib-ui/semantic/heading";
</script>

<article class="size-full">
	<section
		class={merge_classes(
			//
			"size-full",
			"flex flex-col place-content-center place-items-center",
		)}
	>
		<Heading level={1} class="flex-col">
			<Text size="5xl">{"🚧"}</Text>
			<Text>{"Work in progress..."}</Text>
		</Heading>
	</section>
</article>
