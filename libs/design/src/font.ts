import { FontFamily } from "#font/family";
import { FontSize } from "#font/size";
import { FontWeight } from "#font/weight";

// biome-ignore lint/complexity/noStaticOnlyClass: FIXME: What's the alternative?
export class Font {
	public static family = FontFamily;
	public static size = FontSize;
	public static weight = FontWeight;
}
