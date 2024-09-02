<script lang="ts">
import { SOCIAL_CHANNELS } from "@xeho91/lib-asset/social";
import { Reference } from "@xeho91/lib-css/reference";
import { Color } from "@xeho91/lib-design/color";
import { Elevation } from "@xeho91/lib-design/elevation";
import { Space } from "@xeho91/lib-design/space";
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";
import { object_entries } from "@xeho91/lib-snippet/object";

import { Icon } from "#primitive/icon/mod";
import { Text } from "#primitive/text/mod";
import { Item, List } from "#semantic/list/mod";

interface Props extends WithClass {}
let { class: class_ }: Props = $props();

const color = "accent";
</script>

<List
	gap_column="xs"
	class={merge_classes(
		//
		"list-social-channels",
		class_,
	)}
>
	{#each object_entries(SOCIAL_CHANNELS) as [name, data]}
		{@const anchor = new Reference(`icon-${name}`)}
		<Item anchor_name={anchor}>
			<Text
				{color}
				size="3xl"
				class={merge_classes(
					"contents",
					Color.get(color, "solid", 12).class("text", {
						pseudo_class: "focus-within",
					}),
					Color.get(color, "solid", 12).class("text", {
						pseudo_class: "hover",
					}),
				)}
			>
				<a
					href={data.url.toString()}
					class={merge_classes(
						//
						"inline-block",
						"size-fit",
						"leading-none",
					)}
				>
					<Icon
						{name}
						class={merge_classes(
							//
							Elevation.class("text-shadow"),
							Elevation.get(2).class("text-shadow"),
							Elevation.get(1).class("text-shadow", {
								pseudo_class: "hover",
							}),
							Color.class("text-shadow"),
							Color.get(color, "blend", 9).class("text-shadow"),
						)}
					/>
					<Text
						size="s"
						{anchor}
						{color}
						class={merge_classes(
							"link-title",
							"absolute",
							"leading-none",
							Space.get("3xs").class("margin-block-start"),
							Color.get(color, "blend", 12).class("text"),
							"pointer-events-none",
						)}
					>
						{data.name}
					</Text>
				</a>
			</Text>
		</Item>
	{/each}
</List>

<style>
	@layer component {
		:global(.list-social-channels) {
			a:not(:hover) > :global(.link-title) {
				--text-color-light-alpha: 0%;
				--text-color-dark-alpha: 0%;
			}

			:global(.icon) {
				filter: drop-shadow(var(--text-shadow-1));

				transition-duration: var(--transition-dur);
				transition-property: filter;
				transition-timing-function: var(--transition-fn);
			}

			:global(.link-title) {
				inset-area: block-end center;

				transition-duration: var(--transition-dur);
				transition-property: color;
				transition-timing-function: var(--transition-fn);
			}
		}
	}
</style>
