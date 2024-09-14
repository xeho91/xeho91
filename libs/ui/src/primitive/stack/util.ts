import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const STACK_HTML_TAGS = readonly_set(["div", "ul", "ol"]);
export type StackHTMLTag = IterableElement<typeof STACK_HTML_TAGS>;
