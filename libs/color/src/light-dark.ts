import type { AtomicColor } from "#atomic";
import type { ColorCategory, ColorName, ColorStep, ColorType } from "#mod";

export class LightDark<
	const TCategory extends ColorCategory = ColorCategory,
	const TName extends ColorName = ColorName,
	const TType extends ColorType = ColorType,
	const TStep extends ColorStep = ColorStep,
	TLight extends AtomicColor = AtomicColor,
	TDark extends AtomicColor = AtomicColor,
> {
	public readonly category: TCategory;
	public readonly name: TName;
	public readonly type: TType;
	public readonly step: TStep;
	public readonly light: TLight;
	public readonly dark: TDark;

	constructor(params: { category: TCategory; name: TName; type: TType; step: TStep; light: TLight; dark: TDark }) {
		const { category, name, type, step, light, dark } = params;
		this.category = category;
		this.name = name;
		this.type = type;
		this.step = step;
		this.light = light;
		this.dark = dark;
	}
}
