<script lang="ts">
import type { ComponentProps } from "svelte";
import type { HTMLLiAttributes } from "svelte/elements";

import { Container } from "#primitive/container/mod";

type ContainerProps = Omit<ComponentProps<Container>, "name" | "tag">;
interface Props extends ContainerProps, Pick<HTMLLiAttributes, "value"> {}

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
