<script lang="ts">
import { Reference } from "@xeho91/lib-css/reference";
import { Dimension } from "@xeho91/lib-css/value/dimension";
import { Color } from "@xeho91/lib-design/color";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Radius } from "@xeho91/lib-design/radius";
import { Space } from "@xeho91/lib-design/space";
import { Stroke } from "@xeho91/lib-design/stroke";
import { type WithClass, merge_classes, merge_styles } from "@xeho91/lib-feature/css";
import { scroll } from "@xeho91/lib-feature/scroll";
import type { SvelteURL } from "svelte/reactivity";
import { fade } from "svelte/transition";

import type { NavAppLinkData } from "./util";

import { LAYOUT_DEFAULT_FADE, LAYOUT_DEFAULT_NAV_APP_HEIGHT_REFERENCE } from "#layout/default/util";
import { Container } from "#primitive/container/mod";
import { Icon } from "#primitive/icon/mod";
import { Text } from "#primitive/text/mod";
import { List } from "#semantic/list/mod";

interface Props extends WithClass {
	current: SvelteURL;
	links: Array<NavAppLinkData>;
}

let {
	//
	class: class_,
	current,
	links,
}: Props = $props();

let element = $state<HTMLElement>();
let border_box_size = $state<ResizeObserverSize[]>();
let height = $derived(border_box_size?.[0]?.blockSize ?? 0);
let parent = $derived(element?.parentNode as HTMLElement);

$effect(() => {
	parent?.style.setProperty(
		LAYOUT_DEFAULT_NAV_APP_HEIGHT_REFERENCE.toString(),
		new Dimension(height, "px").toString(),
	);
});

function handle_current_link_click(event: MouseEvent) {
	event.preventDefault();
}
</script>

<Container
	bind:element
	bind:border_box_size
	tag="nav"
	name="nav-app"
	box="grid"
	template_columns="subgrid"
	height="fit"
	padding_x="xs"
	padding_y="2xs"
	border="solid"
	stroke="xs"
	radius="xl"
	shadow="2"
	style={merge_styles([
		"inset-block-end",
		`calc(-1 * ${Space.get("2xs").var})`,
	])}
	class={merge_classes(
		scroll.direction === "up" &&
			!scroll.is_at_bottom &&
			!scroll.is_at_top &&
			"translate-y-[100%]",
		// Background
		Color.class("background"),
		Color.get("secondary", "blend", 3).class("background"),
		"backdrop-blur-lg",
		// Border
		Color.class("border"),
		Color.get("secondary", "blend", 6).class("border"),
		// Shadow
		Elevation.get(1).class("box-shadow", { pseudo_class: "hover" }),
		Elevation.get(1).class("box-shadow", { pseudo_class: "focus-within" }),
		Color.get("secondary", "blend", 1).class("box-shadow"),
		class_,
	)}
	in={(node) => fade(node, { ...LAYOUT_DEFAULT_FADE, delay: 200 })}
>
	{@const position_anchor = new Reference("nav-app-current")}
	<span
		style:position-anchor={position_anchor.toString()}
		class={merge_classes(
			//
			"indicator",
			"pointer-events-none",
			"absolute",
			"size-[1.5em]",
			// Background
			Color.class("background"),
			Color.get("accent", "blend", 5).class("background"),
			// Border
			"border-solid",
			Stroke.get("s").class(),
			Color.class("border"),
			Color.get("accent", "opaque", 7).class("border"),
			Radius.get("circle").class(),
		)}
	></span>
	<List
		direction="row"
		justify_content="space-evenly"
		class={merge_classes("col-span-full w-full")}
	>
		{#each links as link}
			{@const is_current = current.pathname === link.href}
			<li class={merge_classes("contents")}>
				<a
					aria-current={is_current ? "page" : undefined}
					href={link.href}
					onclick={is_current ? handle_current_link_click : undefined}
					style:anchor-name={is_current
						? position_anchor.toString()
						: undefined}
					class={merge_classes(
						"flex flex-col items-center",
						!is_current &&
							Color.class("background", {
								pseudo_class: "hover",
							}),
						!is_current &&
							Color.class("background", {
								pseudo_class: "focus",
							}),
						!is_current &&
							Color.get("accent", "opaque", 5).class(
								"background",
								{ pseudo_class: "hover" },
							),
						!is_current &&
							Color.get("accent", "opaque", 5).class(
								"background",
								{ pseudo_class: "focus" },
							),
					)}
				>
					<Icon name={link.icon} class={"z-10"} />
					<Text
						nowrap
						color={is_current ? "accent" : "primary"}
						family="sans"
						weight={"regular"}
						class={merge_classes("")}
					>
						{link.label}
					</Text>
				</a>
			</li>
		{/each}
	</List>
</Container>

<style>
	@layer component {
		:global(.nav-app) {
			/* TODO: Maybe use style:view-transition-name */
			view-transition-name: nav-app;

			@container layout (width <= 500px) {
				grid-column-start: -1;
				grid-column-end: 1;
			}
			@container layout (width > 500px) and (width <= 768px) {
				grid-column-start: 3;
				grid-column-end: 11;
			}
			@container layout (width > 768px) {
				grid-column-start: 4;
				grid-column-end: 10;
			}

			transition-duration: var(--transition-dur);
			transition-property: box-shadow, transform;
			transition-timing-function: var(--transition-fn);

			:global(a) {
				transition-duration: var(--transition-dur);
				transition-property: background-color;
				transition-timing-function: var(--transition-fn);
			}

			.indicator {
				inset-block: anchor(top);
				inset-inline: anchor(center);
				translate: -50% -0.25em;

				transition-duration: var(--transition-dur);
				transition-property: inset;
				transition-timing-function: var(--transition-fn);
			}
		}
	}
</style>
