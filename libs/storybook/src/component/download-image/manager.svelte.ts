import { not_found } from "@xeho91/lib-error/not_found";
import { unreachable } from "@xeho91/lib-error/unreachable";
import { unrecognized } from "@xeho91/lib-error/unrecognized";
import { Rectangle } from "@xeho91/lib-geometry/two-dimension/rectangle";
import { Square } from "@xeho91/lib-geometry/two-dimension/square";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import { default as mime } from "mime/lite";

export type ImageFormat = IterableElement<typeof DownloadImageManager.SUPPORTED_FORMATS>;

export class DownloadImageManager<
	TWidth extends number = number,
	THeight extends number = number,
	TFormat extends ImageFormat = ImageFormat,
> {
	static readonly #SUPPORTED_FORMATS = ["avif", "jpeg", "png", "svg", "webp"] as const;
	public static readonly SUPPORTED_FORMATS = new Set(DownloadImageManager.#SUPPORTED_FORMATS);

	public static [Symbol.iterator]() {
		return DownloadImageManager.SUPPORTED_FORMATS[Symbol.iterator]();
	}

	public format = $state<TFormat>("svg" as TFormat);
	public svg = $state<SVGElement>();
	public scale = $state(1);

	public dimensions = $state<Rectangle<TWidth, THeight>>(new Rectangle(0 as TWidth, 0 as THeight));

	constructor(params: {
		dimensions: Rectangle<TWidth, THeight> | Square<TWidth>;
		format?: DownloadImageManager["format"];
		svg: DownloadImageManager["svg"];
		scale: DownloadImageManager["scale"];
	}) {
		const { dimensions, format = "svg", svg, scale } = params;
		this.dimensions = (dimensions instanceof Square ? dimensions.to_rectangle() : dimensions) as Rectangle<
			TWidth,
			THeight
		>;
		this.format = format as TFormat;
		this.svg = svg;
		this.scale = scale;
	}

	get #mime_type() {
		const { format } = this;
		const mime_type = mime.getType(format);
		if (!mime_type) throw unrecognized(format);
		return mime_type;
	}

	get _svg(): SVGElement {
		const { svg } = this;
		if (!svg) throw not_found("Couldn't find an asset SVG element in the DOM");
		return svg;
	}

	get #svg_url(): string {
		const type = mime.getType("svg");
		if (!type) throw not_found("type", `Couldn't get a mime type for ${type}`);
		const { outerHTML } = this._svg;
		return URL.createObjectURL(new Blob([outerHTML], { type }));
	}

	get #url(): string {
		const { outerHTML } = this._svg;
		return URL.createObjectURL(new Blob([outerHTML], { type: this.#mime_type }));
	}

	public async handle_click(): Promise<void> {
		const basename = window.prompt("File basename?");
		if (!basename) return;
		const canvas = this.#create_canvas();
		const anchor = document.createElement("a");
		const { format } = this;
		anchor.download = `${basename}.${format}`;
		if (format === "svg") {
			anchor.href = this.#url;
		} else {
			const image = await this.#create_image();
			const context = canvas.getContext("2d");
			if (!context) throw unreachable("Failed to get canvas context 2D");
			const { width, height } = canvas;
			context.drawImage(image, 0, 0, width, height);
			anchor.href = canvas.toDataURL(this.#mime_type, 1);
		}
		this.#emit_click(anchor);
	}

	#create_canvas(): HTMLCanvasElement {
		const canvas = document.createElement("canvas");
		const width = $derived(this.dimensions.width * this.scale);
		const height = $derived(this.dimensions.height * this.scale);
		canvas.setAttribute("width", `${width}px`);
		canvas.setAttribute("height", `${height}px`);
		return canvas;
	}

	async #create_image(): Promise<HTMLImageElement> {
		const image = new Image();
		image.src = this.#svg_url;
		await new Promise((resolve, reject) => {
			image.onload = resolve;
			image.onerror = reject;
		});
		return image;
	}

	#emit_click(anchor: HTMLAnchorElement): void {
		anchor.dispatchEvent(new MouseEvent("click"));
	}
}
