import { Color } from "@xeho91/lib-design/color";
import type { FontFamilyName } from "@xeho91/lib-design/font/family";
import type { FontWeightKey } from "@xeho91/lib-design/font/weight";
import { exclude_set, readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

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

export type TextWeight<TFamily extends FontFamilyName> = FontWeightKey<TFamily>;
