import type { Block } from "@xeho91/lib-css/block";
import { Var } from "@xeho91/lib-css/function/var";
import type { Property, ToProperty } from "@xeho91/lib-css/property";
import { Reference } from "@xeho91/lib-css/reference";
import { Ruleset } from "@xeho91/lib-css/ruleset";
import { Selector } from "@xeho91/lib-css/selector";
import type { SelectorClass } from "@xeho91/lib-css/selector/class";
import type { SelectorsJoint } from "@xeho91/lib-css/selector/joint";
import type { PseudoClassName } from "@xeho91/lib-css/selector/pseudo-class";
import type { PseudoElementName } from "@xeho91/lib-css/selector/pseudo-element";
import type { SelectorsList } from "@xeho91/lib-css/selectors-list";
import { readonly_object } from "@xeho91/lib-snippet/object";
import type { Display, ToString } from "@xeho91/lib-type/trait/display";
import type { Observable } from "rxjs/internal/Observable";
import { Subject } from "rxjs/internal/Subject";
import { defer } from "rxjs/internal/observable/defer";

type Name = string;
type Variant = string | number;

/**
 * A key-value pair used in theming and styling.
 * @see {@link https://css-tricks.com/what-are-design-tokens/}
 */
export abstract class DesignToken<TName extends Name = Name, TVariant extends Variant = Variant, TValue = unknown>
	implements Display<DesignTokenKey<TName, TVariant>>
{
	public static readonly CONSTRUCTED = new Map<Variant, DesignToken>();
	public static readonly GLOBAL_RULESETS = new Map<Variant, Ruleset>();
	public static readonly RULESETS = new Map<SelectorClass["name"], Ruleset>();

	private static readonly SUBJECT = readonly_object({
		construct: new Subject<DesignToken>(),
		"create-global-ruleset": new Subject<[Variant, Ruleset]>(),
		"create-class-ruleset": new Subject<[ToString<SelectorsList>, Ruleset]>(),
		"create-property-ruleset": new Subject<[ToString<SelectorsList>, Ruleset]>(),
	});

	public static on = <TEventName extends keyof typeof DesignToken.SUBJECT>(
		event_name: TEventName,
	): Observable<(typeof DesignToken.SUBJECT)[TEventName] extends Subject<infer T> ? T : never> =>
		defer(() => DesignToken.SUBJECT[event_name].asObservable()) as Observable<
			(typeof DesignToken.SUBJECT)[TEventName] extends Subject<infer T> ? T : never
		>;

	protected static create_selector_joint<
		TSelector extends SelectorClass,
		TPseudoClass extends PseudoClassName,
		TPseudoElement extends PseudoElementName,
	>(selector: TSelector, options: { pseudo_class?: TPseudoClass; pseudo_element?: TPseudoElement }): SelectorsJoint {
		const { pseudo_class, pseudo_element } = options;
		// biome-ignore lint/style/useConst: It gets mutated
		let joint = selector.to_joint();
		if (pseudo_class) joint.add(Selector.pseudo.class(pseudo_class));
		if (pseudo_element) joint.add(Selector.pseudo.element(pseudo_element));
		return joint;
	}

	protected static add_class_ruleset(selector: SelectorClass, ruleset: Ruleset): void {
		DesignToken.RULESETS.set(selector.name, ruleset);
		DesignToken.SUBJECT["create-class-ruleset"].next([selector.name, ruleset]);
	}

	protected static add_property_ruleset(selector: SelectorClass, ruleset: Ruleset): void {
		DesignToken.RULESETS.set(selector.name, ruleset);
		DesignToken.SUBJECT["create-property-ruleset"].next([selector.name, ruleset]);
	}

	public readonly name: TName;
	protected readonly variant: TVariant;
	public readonly value: TValue;

	protected constructor(data: {
		name: TName;
		variant: TVariant;
		value: TValue;
	}) {
		const { name, variant, value } = data;
		this.name = name;
		this.variant = variant;
		this.value = value;
		const { key } = this;
		if (!DesignToken.CONSTRUCTED.has(key)) {
			DesignToken.CONSTRUCTED.set(key, this);
			DesignToken.SUBJECT.construct.next(this);
		}
	}

	public get key(): DesignTokenKey<TName, TVariant> {
		return `${this.name}-${this.variant}`;
	}

	public toString(): typeof this.key {
		return this.key;
	}

	public get reference(): Reference<DesignTokenKey<TName, TVariant>> {
		const { key } = this;
		return new Reference(key);
	}

	public get var(): Var<typeof this.reference> {
		return new Var(this.reference);
	}

	public abstract create_global_ruleset(): Ruleset;

	protected add_global_ruleset(ruleset: Ruleset): void {
		const { key } = this;
		DesignToken.GLOBAL_RULESETS.set(this.variant, ruleset);
		DesignToken.SUBJECT["create-global-ruleset"].next([key, ruleset]);
	}

	protected abstract set_target(target?: string | ToProperty | Property): ToProperty | Property;

	protected abstract create_class_block(target?: ToProperty | Property): Block;

	private create_class_ruleset<
		TSelector extends SelectorClass,
		TTarget extends ToProperty | Property,
		TPseudoClass extends PseudoClassName,
		TPseudoElement extends PseudoElementName,
	>(
		selector: TSelector,
		options: {
			target: TTarget;
			pseudo_class?: TPseudoClass;
			pseudo_element?: TPseudoElement;
		},
	): Ruleset {
		const { target } = options;
		const { name } = selector;
		const from_map = DesignToken.RULESETS.get(name);
		if (from_map) return from_map;
		const ruleset = new Ruleset(
			DesignToken.create_selector_joint(selector, options).to_list(),
			this.create_class_block(target),
		);
		DesignToken.add_class_ruleset(selector, ruleset);
		return ruleset;
	}

	public abstract class(...params: unknown[]): SelectorClass;

	protected create_selector_class<
		TTarget extends ToProperty | Property,
		TPrefix extends string | undefined = undefined,
		TPseudoClass extends PseudoClassName | undefined = undefined,
		TPseudoElement extends PseudoElementName | undefined = undefined,
	>(options: {
		target: TTarget;
		prefix?: TPrefix;
		pseudo_class?: TPseudoClass;
		pseudo_element?: TPseudoElement;
	}): SelectorClass<CreateSelectorClassName<TPrefix, TPseudoClass, TPseudoElement, TName, TVariant>> {
		const { target, prefix, pseudo_class, pseudo_element } = options;
		const { key } = this;
		// biome-ignore lint/style/useConst: It gets mutated conditionally
		let selector = Selector.class(key);
		if (prefix) selector.add_prefix(prefix);
		if (pseudo_class) selector.add_suffix(pseudo_class);
		if (pseudo_element) selector.add_suffix(pseudo_element);
		this.create_class_ruleset(selector, {
			target,
			pseudo_class,
			pseudo_element,
		});
		return selector as SelectorClass<
			CreateSelectorClassName<TPrefix, TPseudoClass, TPseudoElement, TName, TVariant>
		>;
	}
}

export type DesignTokenKey<Name extends string, Key extends Variant> = `${Name}-${Key}`;

type CreateSelectorClassName<
	TPrefix extends string | undefined,
	TPseudoClass extends PseudoClassName | undefined,
	TPseudoElement extends PseudoElementName | undefined,
	TName extends string,
	TVariant extends Variant,
> = `${AddSelectorClassNamePrefix<TPrefix>}${DesignTokenKey<TName, TVariant>}${AddSelectorClassNamePseudoClassSuffix<TPseudoClass>}${AddSelectorClassNamePseudoElementSuffix<TPseudoElement>}`;

type AddSelectorClassNamePrefix<TPrefix extends string | undefined> = TPrefix extends string ? `${TPrefix}-` : "";
type AddSelectorClassNamePseudoClassSuffix<TPseudo extends PseudoClassName | undefined> =
	TPseudo extends PseudoClassName ? `-${TPseudo}` : "";
type AddSelectorClassNamePseudoElementSuffix<TPseudo extends PseudoElementName | undefined> =
	TPseudo extends PseudoElementName ? `-${TPseudo}` : "";
