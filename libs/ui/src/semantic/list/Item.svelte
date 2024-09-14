<script lang="ts" generics="TBlock extends ContainerBox = 'block'">
import type { ComponentProps } from "svelte";
import type { HTMLLiAttributes } from "svelte/elements";

import { Container, type ContainerBox } from "#primitive/container/mod";

type ContainerProps = Omit<ComponentProps<Container<"li", TBlock>>, "name" | "tag">;
type Props = ContainerProps & Pick<HTMLLiAttributes, "value">;

let {
	//
	children,
	class: class_,
	...rest_props
}: Props = $props();
</script>

<Container
	{...rest_props}
	tag="li"
	name="item"
>
	{@render children()}
</Container>
