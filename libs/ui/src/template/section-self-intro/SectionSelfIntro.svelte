<script lang="ts">
import { type WithClass, merge_classes } from "@xeho91/lib-feature/css";

import { ListSocialChannels } from "#molecule/list-social-channels/mod";
import { PHOTO_AND_AVATAR_ANCHOR, PhotoAndAvatar } from "#molecule/photo-and-avatar/mod";
import { SelfIntro } from "#organism/self-intro/mod";
import { Section } from "#semantic/section/mod";

interface Props extends WithClass {}

let { class: class_ }: Props = $props();
</script>

<Section
	id="self-intro"
	width="full-grid"
	gutter="default"
	align_content="center"
	justify_content="center"
	class={merge_classes(
		//
		"section-self-intro",
		"cols-span-full",
		class_,
	)}
>
	<SelfIntro
		style={`--position-anchor: ${PHOTO_AND_AVATAR_ANCHOR}`}
		class={merge_classes()}
	/>
	<PhotoAndAvatar />
	<ListSocialChannels class={"col-span-full justify-self-center"} />
</Section>

<style>
	@layer component {
		:global(.section-self-intro) {
			@container layout (width <= 768px) {
				grid-template-rows: 1fr auto auto 3fr;
			}

			:global(> .self-intro) {
				@container layout (width > 768px) {
					position: absolute;
					position-anchor: var(--position-anchor);
					inset-area: end;
					inset-inline-start: anchor(right);
					inset-block: anchor(center);
					align-self: anchor-center;
					margin-inline-start: var(--grid-gutter-default);
				}
				@container layout (width <= 768px) {
					grid-column: 1 / -1;
					grid-row-start: 2;
				}
			}
			:global(.photo-and-avatar .photo) {
				@container layout (width > 768px) {
					grid-column: 2 / 6;
				}
				@container layout (width <= 768px) {
					grid-column: 1 / -1;
					grid-row-start: 3;
					justify-self: center;
				}
			}
			:global(> .list-social-channels) {
				@container layout (width <= 768px) {
					grid-row-start: 4;
					align-self: center;
				}
			}
		}
	}
</style>
