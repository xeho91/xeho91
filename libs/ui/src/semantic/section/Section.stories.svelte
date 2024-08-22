<script context="module" lang="ts">
import { defineMeta } from "@storybook/addon-svelte-csf";
import { Font } from "@xeho91/lib-design/font";
import { pick } from "@xeho91/lib-snippet/object";
import { create_control_from_iterable } from "@xeho91/lib-storybook/arg-type";
import { SHARED_META } from "@xeho91/lib-storybook/meta";
import { PARAMETERS } from "@xeho91/lib-storybook/parameters";
import { VariantsGroup } from "@xeho91/lib-storybook/variants-group";

import * as TextStories from "../../primitive/text/Text.stories.svelte";
import Section from "./Section.svelte";

const { Story } = defineMeta({
	...SHARED_META,
	component: Section,
	tags: ["autodocs"],
	argTypes: {},
	parameters: {
		layout: "centered",
	},
});
</script>

<Story name="Playground" parameters={PARAMETERS.playground} />

<Story name="Default" parameters={PARAMETERS.default} />
