import type { DEFAULT_LOG_LEVEL, LogLevel } from "#mod";

namespace NodeJS {
	interface ProcessEnv {
		/**
		 * @default {@link DEFAULT_LOG_LEVEL}
		 */
		LOG_LEVEL: LogLevel;
	}
}
