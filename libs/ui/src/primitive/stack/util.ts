import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const STACK_HTML_TAGS = readonly_set(["div", "ul", "ol"]);
export type StackHtmlTag = IterableElement<typeof STACK_HTML_TAGS>;

export const STACK_DIRECTIONS = readonly_set(["column", "row"]);
export type StackDirection = IterableElement<typeof STACK_DIRECTIONS>;
