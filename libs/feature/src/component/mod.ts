import type { Snippet } from "svelte";

export interface WithChildren<TParameters extends unknown[] = []> {
	children: Snippet<TParameters>;
}

export interface WithOptionalChildren<TParameters extends unknown[] = []> {
	children?: Snippet<TParameters>;
}
