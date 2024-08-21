import { Color } from "@xeho91/lib-design/color";
import { exclude_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const POPOVER_COLORS = exclude_set(Color.NAMES, ["black", "gray", "white"]);
export type PopoverColor = IterableElement<typeof POPOVER_COLORS>;
