import { readonly_set } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export const CONTAINER_BOXES = readonly_set(["block", "flex", "grid"]);
export type ContainerBox = IterableElement<typeof CONTAINER_BOXES>;
