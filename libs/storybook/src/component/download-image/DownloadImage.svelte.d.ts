/**
 * WARN: **Do not edit!**
          *
 * This directory is automatically generated with script `build:types`.
 */

import { SvelteComponentTyped } from "svelte";
export * from "./manager.svelte";
declare class __sveltets_Render<TWidth extends number = number, THeight extends number = number> {
    props(): Record<string, never>;
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
}
export type DownloadImageProps<TWidth extends number = number, THeight extends number = number> = ReturnType<__sveltets_Render<TWidth, THeight>['props']>;
export type DownloadImageEvents<TWidth extends number = number, THeight extends number = number> = ReturnType<__sveltets_Render<TWidth, THeight>['events']>;
export type DownloadImageSlots<TWidth extends number = number, THeight extends number = number> = ReturnType<__sveltets_Render<TWidth, THeight>['slots']>;
export default class DownloadImage<TWidth extends number = number, THeight extends number = number> extends SvelteComponentTyped<DownloadImageProps<TWidth, THeight>, DownloadImageEvents<TWidth, THeight>, DownloadImageSlots<TWidth, THeight>> {
}
