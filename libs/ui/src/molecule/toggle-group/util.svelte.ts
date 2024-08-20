import { Color } from "@xeho91/lib-design/color";
import { exclude_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const TOGGLE_GROUP_COLORS = exclude_set(Color.NAMES, ["black", "gray", "white"]);
export type ToggleGroupColor = IterableElement<typeof TOGGLE_GROUP_COLORS>;

export type ToggleGroupValue = string | number;

export type ToggleGroupEntry<TValue extends ToggleGroupValue = ToggleGroupValue> = {
	label: string;
	value: TValue;
};

export class ToggleGroupState<TResettable extends boolean = false, TValue extends ToggleGroupValue = ToggleGroupValue> {
	// @ts-expect-error WARN: I know.
	public selected: TValue = $state<TValue>();

	public constructor(default_: TResettable extends true ? TValue | undefined : TValue) {
		this.selected = default_ as TValue;
	}
}
