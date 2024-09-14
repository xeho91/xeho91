import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const BOX_HTML_TAGS = readonly_set([
	//
	"article",
	"div",
	"footer",
	"header",
	"li",
	"nav",
	"section",
	"ol",
	"ul",
]);
export type BoxHTMLTag = IterableElement<typeof BOX_HTML_TAGS>;
