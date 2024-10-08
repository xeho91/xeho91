import type { AtLayerName } from "@xeho91/lib-css/at-rule/layer";
import { AtProperty } from "@xeho91/lib-css/at-rule/property";
import type { Reference } from "@xeho91/lib-css/reference";
import type { Ruleset } from "@xeho91/lib-css/ruleset";
import { DesignToken } from "@xeho91/lib-design/token";
import type { ToString } from "@xeho91/lib-type/trait/display";
import { tick } from "svelte";
import { SvelteMap } from "svelte/reactivity";

class State {
	// TODO: Can it be dynamic, using SvelteMap and have reactivity?
	public reset = $state<Ruleset[]>([]);
	public token = $state<Ruleset[]>([]);
	public framework = $state<Ruleset[]>([]);
	public base = $state<Ruleset[]>([]);
	public component = $state<Ruleset[]>([]);
	public override = $state<Ruleset[]>([]);

	public at_properties = $state<SvelteMap<ToString<Reference>, AtProperty>>(new SvelteMap());

	public add_ruleset(layer: AtLayerName, ruleset: Ruleset): void {
		tick().then(() => {
			this[layer].push(ruleset);
		});
	}

	public add_at_property(at_property: AtProperty): void {
		const { reference } = at_property;
		const stringified_reference = reference.toString();
		const { at_properties } = this;
		if (!at_properties.has(stringified_reference)) {
			tick().then(() => {
				at_properties.set(stringified_reference, at_property);
			});
		}
	}

	constructor() {
		AtProperty.on("construct").subscribe({
			next: (p) => STATE_CSS.add_at_property(p),
		});
		DesignToken.on("construct").subscribe({
			next: (token) => {
				token.create_global_ruleset();
			},
		});
		DesignToken.on("create-global-ruleset").subscribe({
			next: ([_variant, ruleset]) => {
				STATE_CSS.add_ruleset("token", ruleset);
			},
		});
		DesignToken.on("create-property-ruleset").subscribe({
			next: ([_selector, ruleset]) => {
				STATE_CSS.add_ruleset("base", ruleset);
			},
		});
		DesignToken.on("create-class-ruleset").subscribe({
			next: ([_selector, ruleset]) => {
				STATE_CSS.add_ruleset("token", ruleset);
			},
		});
	}
}

export const STATE_CSS = new State();
