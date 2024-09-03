import { Dimension } from "@xeho91/lib-css/value/dimension";
import { DesignRadius } from "@xeho91/lib-design/radius";
import { readonly_object } from "@xeho91/lib-snippet/object";
import type { IterableElement } from "@xeho91/lib-type/iterable";

export type RadiusSize = IterableElement<typeof DesignRadius.SIZES>;

export class Radius<TSize extends RadiusSize = RadiusSize, TValue extends Dimension = Dimension> extends DesignRadius<
	TSize,
	TValue
> {
	public static readonly VALUE = readonly_object({
		xs: new Dimension(1, "px"),
		s: new Dimension(2, "px"),
		m: new Dimension(4, "px"),
		l: new Dimension(8, "px"),
		xl: new Dimension(12, "px"),
		circle: new Dimension(9999, "px"),
	});

	/**
	 * Available design token keys for the radius.
	 */
	public static readonly SIZES = readonly_set(object_keys(DesignRadius.VALUE));

	public static [Symbol.iterator](): IterableIterator<RadiusSize> {
		return DesignRadius.SIZES[Symbol.iterator]();
	}

	/**
	 * Default design token key for the radius.
	 */
	public static readonly DEFAULT = "s" satisfies RadiusSize;

	public static default = () => DesignRadius.get(DesignRadius.DEFAULT);

	public static get = <TSize extends RadiusSize>(
		size: TSize,
	): DesignRadius<TSize, (typeof DesignRadius.VALUE)[TSize]> => {
		const cached = DesignRadius.CONSTRUCTED.get(size);
		if (cached) return cached as DesignRadius<TSize, (typeof DesignRadius.VALUE)[TSize]>;
		return new DesignRadius(size, DesignRadius.VALUE[size]);
	};

	constructor(key: TSize, value: TValue) {
		super({ name: DesignRadius.NAME, variant: key, value });
	}

	public set_target<TTarget extends Target>(target: TTarget): RadiusTarget<TTarget> {
		return new RadiusTarget(target);
	}

	protected create_class_declaration<TTarget extends RadiusTarget>(
		target: TTarget,
	): Declaration<InferProperty<TTarget>, InferValue<DesignRadius["var"]>> {
		const { var: var_ } = this;
		const property = target.to_property() as InferProperty<TTarget>;
		return new Declaration(property, var_.to_value());
	}

	protected create_class_block<TTarget extends RadiusTarget>(
		target: TTarget,
	): Block<[ReturnType<DesignRadius["create_class_declaration"]>]> {
		return new Block(this.create_class_declaration(target));
	}

	public create_global_ruleset(): Ruleset {
		const { key, reference, value } = this;
		const from_map = DesignRadius.GLOBAL_RULESETS.get(key);
		if (from_map) return from_map;
		const selector = Selector.pseudo.class("root");
		const declaration = new Declaration(reference.to_property(), value.to_value());
		const ruleset = new Ruleset(selector.to_list(), declaration.to_block());
		this.add_global_ruleset(ruleset);
		return ruleset;
	}

	public class<
		TTarget extends Target = "all",
		TPseudoClass extends PseudoClassName | undefined = undefined,
		TPseudoElement extends PseudoElementName | undefined = undefined,
	>(raw_target = "all" as TTarget, options: { pseudo_class?: TPseudoClass; pseudo_element?: TPseudoElement } = {}) {
		const target = this.set_target(raw_target);
		const { name: prefix } = target;
		return this.create_selector_class({
			...options,
			target,
			prefix,
		});
	}
}

type Target = ConstructorParameters<typeof RadiusTarget>[0];
