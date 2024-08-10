import type { InputType, Parameters } from "@storybook/types";
import { stringified_union_from_array } from "@xeho91/lib-snippet/array";
import { readonly_object } from "@xeho91/lib-snippet/object";
import type { Range } from "@xeho91/lib-struct/range";
import type { JoinableItem } from "@xeho91/lib-type/array";
import type { IterableElement } from "@xeho91/lib-type/iterable";

type Category = "design" | "options" | "meta" | "download";
type Subcategory = "overrides";

interface CategorizedArgsTable {
	category?: Category;
	subcategory?: Subcategory;
}

type SetIterableControlOptions<TTIterable extends Iterable<unknown>> = InputType & {
	summary?: string;
	default?: IterableElement<TTIterable>;
} & CategorizedArgsTable;

/**
 * Create Storybook's {@link InputType} from an iterable element entries _(keys or values)_.
 */
export function create_control_from_iterable<
	Item extends JoinableItem,
	const TIterable extends Iterable<Item> & { name?: string; DEFAULT?: Item },
	const Options extends SetIterableControlOptions<TIterable>,
>(iterable: TIterable, options = {} as Options): InputType {
	const arrayified = [...iterable];

	return {
		control: {
			type: arrayified.length > 5 ? "select" : "radio",
		},
		options: arrayified,
		table: {
			category: options.category?.toUpperCase(),
			subcategory: options.subcategory?.toUpperCase(),
			defaultValue: {
				summary: set_summary(options.default ?? iterable.DEFAULT),
			},
			type: {
				summary: options.summary ?? iterable?.name,
				detail: stringified_union_from_array(arrayified),
			},
		},
		...options,
	};
}

/**
 * Create Storybook's {@link InputType} from {@link Boolean}.
 */
export function create_control_from_boolean<const TOptions extends InputType & CategorizedArgsTable>(
	default_value: boolean,
	options = {} as TOptions,
): InputType {
	return {
		control: {
			type: "boolean",
		},
		table: {
			category: options.category?.toUpperCase(),
			subcategory: options.subcategory?.toUpperCase(),
			defaultValue: {
				summary: set_summary(default_value),
			},
			type: {
				summary: "boolean",
			},
		},
		...options,
	};
}

/**
 * Create Storybook's {@link InputType} from {@link String}.
 */
export function create_control_from_string<
	const TString extends string,
	const TOptions extends InputType & CategorizedArgsTable,
>(default_value: TString, options = {} as TOptions): InputType {
	return {
		control: {
			type: "text",
		},
		table: {
			category: options.category?.toUpperCase(),
			subcategory: options.subcategory?.toUpperCase(),
			defaultValue: {
				summary: set_summary(default_value),
			},
			type: {
				summary: "string",
			},
		},
		...options,
	};
}

/**
 * Create Storybook's {@link InputType} from {@link Range}.
 */
export function create_control_from_range<
	const TRange extends Range,
	const TOptions extends InputType & CategorizedArgsTable,
>(default_value: TRange, options = {} as TOptions): InputType {
	const { min, max, step } = default_value;

	return {
		control: {
			type: "range",
			min,
			max,
			step,
		},
		table: {
			category: options.category?.toUpperCase(),
			subcategory: options.subcategory?.toUpperCase(),
			defaultValue: {
				summary: default_value.toString(),
				detail: `{ min: ${min}, max: ${max}, step: ${step} }`,
			},
			type: {
				summary: "Range<TMin, TMax>",
				detail: "{ min: TMin, max: TMax, step: number }",
			},
		},
		...options,
	};
}

function set_summary<TItem extends JoinableItem>(
	item?: TItem,
): NonNullable<NonNullable<InputType["table"]>["defaultValue"]>["summary"] {
	return typeof item === "string" ? `"${item}"` : item?.toString();
}

export const PARAMETERS = readonly_object({
	default: {
		controls: { disable: true },
		layout: "centered",
	},
	playground: {
		controls: { disable: false },
		layout: "centered",
	},
	variants: {
		controls: { disable: true },
		// docs: {
		// 	source: {
		// 		rawCode: null,
		// 	},
		// },
		layout: "padded",
	},
} satisfies Record<string, Parameters>);
