import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const APP_COLOR_SCHEMES = readonly_set(["light", "system", "dark"]);
export type AppColorScheme = IterableElement<typeof APP_COLOR_SCHEMES>;
