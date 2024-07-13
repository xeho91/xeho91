import type { ComponentProps } from "svelte";

import type SVG from "./component/_sub/SVG.svelte";

// export const SAFE_SPACE = SHADOW.x + SHADOW.blur + (FRAME.size * 2 + SHADOW.x + SHADOW.blur);
// export const LOGO_MIN_WIDTH = DIMENSIONS_LOGOTYPE[0] + SAFE_SPACE;
// export const LOGO_MIN_HEIGHT = DIMENSIONS_LOGOTYPE[1] + SAFE_SPACE;

const targets = [
	//
	"title",
	"description",
	"background",
	"gradient",
	"frame",
	"logomark",
	"logotype",
	"shadow",
] as const;
type IDTarget = (typeof targets)[number];

export function set_id<TId extends string, TTarget extends IDTarget>(id: TId, target: TTarget): `${TId}-${TTarget}` {
	return `${id}-${target}`;
}

type Meta = Pick<ComponentProps<SVG>, "id" | "title" | "description">;

export const META_LOGO = {
	id: "xeho91-logo",
	title: "xeho91's logo",
	description:
		'It contains logotype painted in the style of quickly using a paintbrush on the wall. It\'s written "xeho91" in capital letters.',
} as const satisfies Meta;
