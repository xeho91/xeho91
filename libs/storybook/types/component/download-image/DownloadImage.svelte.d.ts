export * from "./manager.svelte";
import type { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";
import type { Square } from "@xeho91/lib-geometry/two-dimension/square";
import type { Snippet } from "svelte";
import type { ImageFormat } from "./manager.svelte";
declare class __sveltets_Render<TWidth extends number = number, THeight extends number = number> {
    props(): {
        children: Snippet;
        dimensions: Rectangle<TWidth_1, THeight_1> | Square<TWidth_1>;
        svg: SVGElement | undefined;
        format?: ImageFormat;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {};
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <TWidth extends number = number, THeight extends number = number>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TWidth, THeight>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TWidth, THeight>['props']>, ReturnType<__sveltets_Render<TWidth, THeight>['events']>, ReturnType<__sveltets_Render<TWidth, THeight>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<TWidth, THeight>['bindings']>;
    } & ReturnType<__sveltets_Render<TWidth, THeight>['exports']>;
    <TWidth extends number = number, THeight extends number = number>(internal: unknown, props: ReturnType<__sveltets_Render<TWidth, THeight>['props']> & {
        $$events?: ReturnType<__sveltets_Render<TWidth, THeight>['events']>;
    }): ReturnType<__sveltets_Render<TWidth, THeight>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any, any>['bindings']>;
}
declare const DownloadImage: $$IsomorphicComponent;
type DownloadImage<TWidth extends number = number, THeight extends number = number> = InstanceType<typeof DownloadImage<TWidth, THeight>>;
export default DownloadImage;
