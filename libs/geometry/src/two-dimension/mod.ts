import type { Display } from "@xeho91/lib-type/trait/display";

export abstract class TwoDimensionalFigure implements Display {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public abstract half(...args: any[]): number | Array<number>;
	public abstract get aspect_ratio(): number;
	public abstract get perimeter(): number;
	public abstract get area(): number;
	public abstract toString(): string;
}
