import type { FontWeightSansKey } from "@xeho91/lib-design/font/weight";
import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const HEADING_LEVELS = readonly_set([1, 2, 3, 4, 5, 6]);
export type HeadingLevel = IterableElement<typeof HEADING_LEVELS>;

export type HeadingWeight = FontWeightSansKey;
