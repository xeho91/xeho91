import { Color } from "@xeho91/lib-design/color";
import { exclude_set, readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const TEXT_WEIGHTS = readonly_set([
	"thin",
	"extra-light",
	"light",
	"regular",
	"medium",
	"semi-bold",
	"bold",
	"extra-bold",
	"black",
]);
export type TextWeight = IterableElement<typeof TEXT_WEIGHTS>;

export const TEXT_HTML_TAGS = readonly_set([
	"code",
	"figcaption",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"p",
	"span",
] satisfies Array<keyof HTMLElementTagNameMap>);
export type TextHTMLTag = IterableElement<typeof TEXT_HTML_TAGS>;
export type TextHTMLTagsMap = Pick<HTMLElementTagNameMap, TextHTMLTag>;

export const TEXT_COLORS = exclude_set(Color.NAMES, []);
export type TextColor = IterableElement<typeof TEXT_COLORS>;
