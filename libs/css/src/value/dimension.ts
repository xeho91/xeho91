import { extract_set_entries } from "@xeho91/lib-snippet/set";
import type { IterableElement } from "@xeho91/lib-type/iterable";
import type { Display } from "@xeho91/lib-type/trait/display";
import type { Dimension as DimensionAST } from "css-tree";

import type { ToAST } from "#ast";
import { Syntax, type SyntaxUnits } from "#syntax";
import { Unit } from "#unit";
import { Value, type ToValue } from "#value";

const POSSIBLE_SYNTAX_NAMES = extract_set_entries(Syntax.NAMES, ["angle", "length"]);
type PossibleSyntaxName = IterableElement<typeof POSSIBLE_SYNTAX_NAMES>;
type PossibleUnits = SyntaxUnits<PossibleSyntaxName>;

export class Dimension<TValue extends number = number, TUnit extends PossibleUnits = PossibleUnits>
	implements Display, ToAST, ToValue
{
	public value: TValue;
	public unit: Unit<TUnit>;

	constructor(value: TValue, unit: TUnit) {
		this.value = value;
		this.unit = new Unit(unit);
	}

	public toString(): Stringified<TValue, TUnit> {
		return `${this.value}${this.unit.toString()}`;
	}

	public to_ast(): DimensionAST {
		const { unit, value } = this;
		return {
			type: "Dimension",
			value: value.toString(),
			unit: unit.toString(),
		};
	}

	public to_value(): Value<[typeof this]> {
		return new Value(this);
	}
}

type Stringified<TValue extends number, TUnit extends PossibleUnits> = `${TValue}${TUnit}`;
