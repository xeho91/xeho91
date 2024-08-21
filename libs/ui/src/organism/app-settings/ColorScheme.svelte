<script lang="ts">
import { capitalize } from "@xeho91/lib-snippet/string";

import { ToggleGroup } from "#molecule/toggle-group/mod";
import { Icon, type IconName } from "#primitive/icon/mod";
import { Text } from "#primitive/text/mod";

import { Stack } from "../../primitive/stack/mod";
import { APP_COLOR_SCHEMES, type AppColorScheme } from "./util";

const icons_map = {
	light: "sun",
	system: "monitor",
	dark: "moon",
} as const satisfies Record<AppColorScheme, IconName>;
const attribute_name = "data-color-scheme";
const default_: AppColorScheme =
	(window?.localStorage.getItem(attribute_name) as AppColorScheme | undefined) ?? "system";

function handle_change(value: AppColorScheme) {
	window.document.documentElement.setAttribute("data-color-scheme", value);
	window.localStorage.setItem(attribute_name, value);
}
</script>

<Stack direction="column" gap_row="3xs">
	<Text color="secondary" size="s" family="sans" weight="medium">
		{"Color scheme"}
	</Text>
	<ToggleGroup
		color="secondary"
		name="color-scheme"
		entries={[...APP_COLOR_SCHEMES].map((value) => ({ label: capitalize(value), value }))}
		default={default_}
		onchange={handle_change}
	>
		{#snippet children(value, _state)}
			<Text color="secondary">
				<Icon name={icons_map[value]} />
			</Text>
		{/snippet}
	</ToggleGroup>
</Stack>
