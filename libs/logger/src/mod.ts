import type { IterableElement } from "@xeho91/lib-type/iterable";
import pino from "pino";
import pretty from "pino-pretty";

/** Set of available log levels for printing certain group of messages into terminal. */
export const LOG_LEVELS = new Set([
	// biome-ignore format: Easier to read & modify
	"silent",
	"fatal",
	"error",
	"warn",
	"info",
	"debug",
	"trace",
] as const);

/**
 * @see {@link LOG_LEVELS}
 * @default {@link DEFAULT_LOG_LEVEL}
 */
export type LogLevel = IterableElement<typeof LOG_LEVELS>;

export const DEFAULT_LOG_LEVEL = "info" satisfies LogLevel;

/**
 * A namespace which uses {@link pino} as logger, and wraps all of the set logging level methods.
 *
 * @example
 * ```
 * import { log } from "@xeho91/lib-logger";
 *
 * log.silent("This never gets printed.");
 * log.fatal("This is for kind of messages which should print prior to process termination.");
 * log.error("This is for kind of messages that causes an invalid operation, but the process can continue.");
 * log.warn("For anything that should be considered as warning.");
 * log.info("Informational, obviously");
 * log.debug("For debugging purposes.");
 * log.fatal("Don't overuse it.");
 * ```
 */
export const log = pino(
	{
		level: (process.env.LOG_LEVEL ?? DEFAULT_LOG_LEVEL) as LogLevel,
	},
	pretty({
		colorize: true,
		levelFirst: true,
	}),
);

export function set_logger_level(level: LogLevel): void {
	if (level !== "silent") {
		console.log(`Logger level is set to: ${level}`);
	}

	log.level = level;
}

if (import.meta.vitest) {
	const { afterAll, describe, expect, test, vi } = import.meta.vitest;

	describe("log", () => {
		const message = "this is a test";

		for (const level of LOG_LEVELS) {
			const logMock = vi.spyOn(log, level).mockImplementation(() => {});

			test(`.${level}("${message}") - call succeed`, () => {
				log[level](message);
				expect(logMock).toHaveBeenCalledOnce();
				expect(logMock).toHaveBeenLastCalledWith(message);
			});

			afterAll(() => {
				logMock.mockReset();
			});
		}
	});
}
