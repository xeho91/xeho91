/**
 * Related to social channels.
 * @module
 */

import { readonly_object } from "@xeho91/lib-snippet/object";

/**
 * Mapped object with list of currently available and in use social channels.
 */
export const SOCIAL_CHANNELS = readonly_object({
	discord: {
		name: "Discord",
		url: new URL("https://discord.com/channels/@xeho91"),
	},
	email: {
		name: "Email",
		url: new URL("mailto:xeho91@pm.me"),
	},
	github: {
		name: "GitHub",
		url: new URL("https://github.com/xeho91"),
	},
	matrix: {
		name: "Matrix",
		url: new URL("https://matrix.to/#/@xeho91:matrix.org"),
	},
	linkedin: {
		name: "LinkedIn",
		url: new URL("https://linkedin.com/in/xeho91"),
	},
	twitter: {
		name: "Twitter",
		url: new URL("https://twitter.com/xeho91"),
	},
}) satisfies Record<string, { name: string; url: URL }>;

/**
 * @see {@link SOCIAL_CHANNELS}
 */
export type SocialChannelName = keyof typeof SOCIAL_CHANNELS;
