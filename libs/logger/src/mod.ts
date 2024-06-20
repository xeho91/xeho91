import type { SetKeys } from "@xeho91/lib-type/set";
import pino from "pino";
import pretty from "pino-pretty";

/** Enum of available log levels for printing certain group of messages into terminal. */
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

/** @see {@link LOG_LEVELS} */
export type LogLevel = SetKeys<typeof LOG_LEVELS>;

export const DEFAULT_LOG_LEVEL: LogLevel = "info";

export const log = pino(
	{
		level: (process.env.LOG || DEFAULT_LOG_LEVEL) as LogLevel,
	},
	pretty({
		colorize: true,
		levelFirst: true,
	}),
);

export function set_logger_level(level: LogLevel) {
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
