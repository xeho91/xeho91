export abstract class TwoDimensionalFigure {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public abstract half(...args: any[]): number | Array<number>;
	public abstract get aspect_ratio(): number;
	public abstract get perimeter(): number;
	public abstract get area(): number;
}
