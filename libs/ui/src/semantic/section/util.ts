import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const SECTION_WIDTH = readonly_set(["full-grid", "full-screen"]);
export type SectionWidth = IterableElement<typeof SECTION_WIDTH>;

export const SECTION_HEIGHT = readonly_set(["min-main", "full-main"]);
export type SectionHeight = IterableElement<typeof SECTION_HEIGHT>;
